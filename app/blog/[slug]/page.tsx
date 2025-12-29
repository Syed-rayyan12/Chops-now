import { Header } from '@/components/customer-panel-components/header';
import { Footer } from '@/components/customer-panel-components/footer';
import { BlogDetail } from '@/components/customer-panel-components/blog-detail';


const blogPosts: Record<string, any> = {
  'rise-of-african-caribbean-food': {
    title: 'The Rise of African & Caribbean Food in the UK',
    date: '4 Oct',
    image: '/blog-3.jpeg',
    content: `
      <h2>The Rise of African & Caribbean Food in the UK</h2>
      
      <h3>1. Cultural Roots and Migration Influence</h3>
      <p>The growth of African and Caribbean food in the UK is deeply connected to migration and cultural heritage. Communities that settled in Britain brought traditional recipes and cooking methods that preserved their identity. Over time, these foods moved beyond family homes and local eateries, becoming an important part of the UK's multicultural food scene.</p>
      
      <h3>2. Growing Demand for Bold and Authentic Flavours</h3>
      <p>British consumers are increasingly drawn to rich, spicy, and authentic flavours. Dishes such as jerk chicken, jollof rice, plantain, and oxtail have gained widespread popularity due to their depth of taste and unique preparation styles. This growing curiosity has helped African and Caribbean food reach a much wider audience.</p>
      
      <h3>3. Street Food and Modern Dining Experiences</h3>
      <p>Street food markets and pop-up events have played a major role in introducing African and Caribbean cuisine to the public. These spaces allow chefs to showcase traditional dishes in modern, creative ways. As a result, many successful street food businesses have expanded into full-scale restaurants across major UK cities.</p>
      
      <h3>4. Media, Social Platforms, and Food Influencers</h3>
      <p>Social media and digital platforms have significantly boosted the visibility of African and Caribbean food in the UK. Food creators, chefs, and influencers share recipes, cooking videos, and cultural stories, helping to educate audiences and celebrate the richness of these cuisines. This online exposure has accelerated mainstream acceptance.</p>
      
      <h3>5. A Lasting Impact on the UK Food Industry</h3>
      <p>The rise of African and Caribbean food is shaping the future of the UK food industry. Supermarkets, restaurants, and food brands are embracing these flavours, reflecting long-term demand rather than a passing trend. This movement not only enriches British cuisine but also supports cultural recognition and economic growth.</p>
    `
  },
  'top-10-must-try-dishes': {
    title: 'Top 10 Must-Try African & Caribbean Dishes',
    date: '28 Sep',
    image: '/blog-2.jpeg',
    content: `
      <h2>Top 10 Must-Try African & Caribbean Dishes</h2>
      <p>From jollof to jerk chicken, here are the dishes you simply cannot miss when exploring African and Caribbean cuisine.</p>
      
      <h3>1. Jollof Rice</h3>
      <p>This West African favourite has become iconic. Cooked with tomato sauce, spices, and often meat or fish, it's comfort food at its finest.</p>
      
      <h3>2. Jerk Chicken</h3>
      <p>A Caribbean classic, jerk chicken is marinated in a spicy blend of scotch bonnet peppers, allspice, and other seasonings before being grilled to perfection.</p>
      
      <h3>3. Fufu</h3>
      <p>Made from pounded plantain or yam, fufu is a staple side dish that's both filling and delicious, especially when served with palm soup or egusi soup.</p>
      
      <h3>4. Akee and Saltfish</h3>
      <p>A Jamaican national dish, this combination of creamy akee fruit and salted cod is typically served for breakfast and is truly unforgettable.</p>
      
      <h3>5. Suya</h3>
      <p>Nigerian street food favourite, suya is spicy grilled meat coated in a peanut spice mixture. It's perfect as a snack or appetizer.</p>
      
      <h3>6. Gumbo</h3>
      <p>A thick stew from Louisiana with African roots, gumbo is hearty, flavourful, and tells a story of cultural fusion.</p>
      
      <h3>7. Plantain Chips</h3>
      <p>Simple yet addictive, fried plantain chips are the perfect side or snack, offering a satisfying crunch and subtle sweetness.</p>
      
      <h3>8. Pepper Soup</h3>
      <p>A warming broth loaded with meat or fish and various spices, pepper soup is comfort in a bowl.</p>
      
      <h3>9. Doubles</h3>
      <p>A Trinidadian street food, doubles consist of fried bread with chickpea curry and spicy tamarind sauce.</p>
      
      <h3>10. Ceviche</h3>
      <p>While having Latin American roots, African and Caribbean chefs have made it their own, using local fish and creative twists.</p>
    `
  },
  'healthy-eating-afro-caribbean': {
    title: 'Healthy Eating with Afro-Caribbean Flavours',
    date: '20 Sep',
    image: '/blog-1.jpeg',
    content: `
      <h2>Healthy Eating with Afro-Caribbean Flavours</h2>
      <p>Fresh vegetables and fruits used in African and Caribbean cooking like plantain, callaloo, and okra are not only delicious but also incredibly nutritious.</p>
      
      <h3>The Nutritional Powerhouses</h3>
      <p>African and Caribbean cuisines are built on ingredients that nature intended for optimal health. Okra is rich in fibre and helps with digestion. Callaloo is packed with vitamins and minerals. Plantain provides complex carbohydrates and potassium.</p>
      
      <h3>Cooking Methods Matter</h3>
      <p>Traditional African and Caribbean cooking methods often involve steaming, grilling, and stewing rather than deep-frying. These methods preserve nutrients and reduce unnecessary fats.</p>
      
      <h3>Spices for Health</h3>
      <p>The spices used in these cuisines - turmeric, ginger, garlic, and scotch bonnet peppers - have anti-inflammatory and antioxidant properties that contribute to overall wellness.</p>
      
      <h3>Creating a Balanced Plate</h3>
      <p>A traditional African or Caribbean meal often naturally includes proteins, vegetables, and complex carbohydrates in balanced proportions, making it easy to eat healthily without counting calories.</p>
      
      <h3>Conclusion</h3>
      <p>You don't have to sacrifice flavour for health. African and Caribbean cuisines prove that the most nutritious meals can also be the most delicious.</p>
    `
  },
  'history-of-jollof-rice': {
    title: 'The History of Jollof Rice',
    date: '15 Sep',
    image: '/blog-0.png',
    content: `
      <h2>The History of Jollof Rice</h2>
      <p>Discover the origins and cultural significance of West Africa's most beloved dish.</p>
      
      <h3>Origins in West Africa</h3>
      <p>Jollof rice originated in West Africa, with roots traced back to the Wolof people of Senegal. From there, it spread across the region, with each country developing its own unique variation.</p>
      
      <h3>Colonial Influence</h3>
      <p>The dish was influenced by Persian and Indian rice dishes brought through trade routes. The combination of local West African ingredients with these external influences created something truly unique.</p>
      
      <h3>Cultural Significance</h3>
      <p>Jollof rice is not just food; it's a symbol of celebration, community, and cultural identity. It's served at celebrations, weddings, and family gatherings across West Africa.</p>
      
      <h3>The Great Jollof Debate</h3>
      <p>There's a friendly rivalry among West African countries about who makes the best jollof rice. Whether it's Nigeria, Ghana, Senegal, or another country, each has passionate defenders of their version.</p>
      
      <h3>Modern-Day Jollof</h3>
      <p>Today, jollof rice has become a global phenomenon, with chefs putting creative spins on this classic while honouring its traditional roots.</p>
    `
  },
  'caribbean-street-food-guide': {
    title: 'Caribbean Street Food Guide',
    date: '10 Sep',
    image: '/blogpost-1.png',
    content: `
      <h2>Caribbean Street Food Guide</h2>
      <p>Explore the vibrant world of Caribbean street food from doubles to patties and beyond.</p>
      
      <h3>The Street Food Culture</h3>
      <p>Caribbean street food is a celebration of bold flavours, quick bites, and community. These foods are affordable, accessible, and absolutely delicious.</p>
      
      <h3>Must-Try Street Foods</h3>
      <p>Doubles from Trinidad, beef patties from Jamaica, and empanadas are just the beginning. Each Caribbean island has its own specialties that reflect local ingredients and cultural influences.</p>
      
      <h3>Where to Find Them</h3>
      <p>In the UK, you can find authentic Caribbean street food at food markets, street stalls, and dedicated restaurants. Keep an eye out for food festivals that celebrate Caribbean cuisine.</p>
      
      <h3>Making Them at Home</h3>
      <p>Many Caribbean street foods are surprisingly easy to make at home. With the right recipes and ingredients, you can bring the Caribbean experience to your own kitchen.</p>
    `
  },
  'cooking-with-plantains': {
    title: 'Cooking with Plantains',
    date: '5 Sep',
    image: '/blogpost-2.png',
    content: `
      <h2>Cooking with Plantains</h2>
      <p>Learn different ways to prepare this versatile ingredient in your kitchen.</p>
      
      <h3>Understanding Plantains</h3>
      <p>Plantains are a staple in African and Caribbean cooking. Unlike bananas, they're starchy and versatile, used in both savoury and sweet dishes.</p>
      
      <h3>Cooking Methods</h3>
      <p>Plantains can be fried, boiled, baked, grilled, or mashed. Each method brings out different flavours and textures, making plantains incredibly versatile.</p>
      
      <h3>Popular Plantain Dishes</h3>
      <p>From plantain chips to tostones (fried green plantains), maduros (sweet fried plantains), and plantain fufu, there are endless possibilities.</p>
      
      <h3>Nutritional Benefits</h3>
      <p>Plantains are rich in potassium, vitamin C, and B vitamins. They're a great source of dietary fibre and provide sustained energy.</p>
      
      <h3>Tips for Cooking</h3>
      <p>Choose plantains based on ripeness - green for savoury dishes, yellow for slightly sweet, and black for very sweet. Store them at room temperature until ready to use.</p>
    `
  },
  'spice-blends-caribbean': {
    title: 'Spice Blends of the Caribbean',
    date: '1 Sep',
    image: '/blogpost-3.png',
    content: `
      <h2>Spice Blends of the Caribbean</h2>
      <p>A deep dive into the aromatic spice mixes that define Caribbean cuisine.</p>
      
      <h3>The Foundation of Flavour</h3>
      <p>Caribbean spice blends are the soul of the cuisine. They combine ancient traditions with available local ingredients to create unique flavour profiles.</p>
      
      <h3>Key Spices</h3>
      <p>Allspice, scotch bonnet peppers, nutmeg, cinnamon, and cloves are staples. These spices are often combined in specific ratios to create traditional blends.</p>
      
      <h3>Popular Blends</h3>
      <p>Jerk seasoning, curry powder, and various hot pepper sauces are the foundations of many Caribbean dishes. Each island has its own signature blends.</p>
      
      <h3>Making Your Own</h3>
      <p>Creating your own spice blends at home is easier than you might think. We provide recipes for essential Caribbean spice mixes that you can make in bulk and store.</p>
      
      <h3>Using Spices Wisely</h3>
      <p>Understanding how to balance spices is key. Too much heat can overpower other flavours, while too little leaves a dish bland.</p>
    `
  },
  'african-soups-stews': {
    title: 'African Soups and Stews',
    date: '25 Aug',
    image: '/blogpost-4.png',
    content: `
      <h2>African Soups and Stews</h2>
      <p>Warm, hearty, and full of flavour - explore traditional African comfort food.</p>
      
      <h3>The Role of Soups in African Culture</h3>
      <p>Soups and stews are central to African cuisine. They're often served as main courses and are designed to be eaten communally, bringing families and communities together.</p>
      
      <h3>Essential Ingredients</h3>
      <p>African soups typically feature groundnuts (peanuts), various vegetables, proteins, and aromatic spices. The base is often palm oil or coconut milk.</p>
      
      <h3>Popular Varieties</h3>
      <p>Egusi soup, palm soup, okra soup, and groundnut soup are just a few examples. Each has unique characteristics and regional variations.</p>
      
      <h3>Slow Cooking Tradition</h3>
      <p>These soups are traditionally made slowly, allowing flavours to develop and meld together. The result is deeply flavourful and comforting.</p>
      
      <h3>Serving and Enjoying</h3>
      <p>African soups are typically served with fufu, rice, or bread. The combination of the soup with these starches creates a complete, satisfying meal.</p>
    `
  },
  'art-of-grilling-suya': {
    title: 'The Art of Grilling Suya',
    date: '20 Aug',
    image: '/blogpost-5.png',
    content: `
      <h2>The Art of Grilling Suya</h2>
      <p>Master the technique of making this spicy Nigerian street food favourite.</p>
      
      <h3>What is Suya?</h3>
      <p>Suya is a Nigerian street food made from thinly sliced meat that's marinated in spices and grilled over charcoal. It's served as a popular snack or appetizer.</p>
      
      <h3>The Spice Blend</h3>
      <p>The distinctive suya spice is made from ground peanuts, chilli peppers, garlic, ginger, and various other spices. This blend is what makes suya truly special.</p>
      
      <h3>Preparation Techniques</h3>
      <p>The meat must be sliced thinly and marinated properly. The marinade should coat every piece evenly to ensure maximum flavour.</p>
      
      <h3>Grilling to Perfection</h3>
      <p>Suya requires high heat and careful timing. The meat should be charred on the outside while remaining tender on the inside. Traditional charcoal grilling is best.</p>
      
      <h3>Serving Suggestions</h3>
      <p>Suya is best served hot with lime wedges, sliced onions, and tomatoes. It can also be served with pap (a maize porridge) or bread.</p>
      
      <h3>Making It at Home</h3>
      <p>While charcoal grilling is traditional, you can make excellent suya at home using a grill pan or regular oven grill. The key is high heat and proper timing.</p>
    `
  }
};

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = blogPosts[params.slug];

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600">Sorry, we couldn't find the blog post you're looking for.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BlogDetail blog={blog} />
      <Footer />
    </div>
  );
}
