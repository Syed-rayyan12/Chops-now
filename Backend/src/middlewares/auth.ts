import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import prisma from "../config/db";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (roles: string[] = []) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ADMIN is privileged and admin accounts can be deleted or downgraded, so we
    // don't trust the role baked into a (up-to-12h) token. Re-confirm against the
    // DB that the account still exists and is still an ADMIN before allowing the
    // request, so revocation takes effect immediately rather than on token expiry.
    if (decoded.role === "ADMIN") {
      try {
        const admin = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { role: true },
        });
        if (!admin || admin.role !== "ADMIN") {
          return res.status(401).json({ message: "Admin access revoked" });
        }
      } catch (err) {
        return res.status(500).json({ message: "Authorization check failed" });
      }
    }

    req.user = decoded;
    next();
  };
};

// Gate operational rider endpoints behind admin approval. A RIDER token alone is
// not enough — riders authenticate via password login OR Google OAuth, and the
// OAuth path issues a token to brand-new (PENDING) riders so they can finish
// onboarding. This middleware re-checks approvalStatus from the DB (not the
// token), so neither an OAuth rider nor a rider rejected after their token was
// issued can reach order/availability/online endpoints. Apply it AFTER
// `authenticate(["RIDER"])`, and leave it off onboarding/self routes
// (complete-profile, update-profile, me) so pending riders can still set up.
export const requireApprovedRider = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const riderId = req.user?.id;
  if (!riderId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
      select: { approvalStatus: true },
    });
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }
    if (rider.approvalStatus !== "APPROVED") {
      return res.status(403).json({
        message:
          rider.approvalStatus === "REJECTED"
            ? "Your rider application was not approved. Please contact support."
            : "Your rider account is pending admin approval. You'll be notified once it's approved.",
        approvalStatus: rider.approvalStatus,
        pendingApproval: rider.approvalStatus === "PENDING",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Authorization check failed" });
  }
};
