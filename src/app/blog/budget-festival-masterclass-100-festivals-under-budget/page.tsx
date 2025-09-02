'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { featuredPosts } from '../featuredPosts';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export default function BudgetFestivalBlogPost() {
  // Find the blog post from featuredPosts
  const post = featuredPosts.find(post => post.slug === 'budget-festival-masterclass-100-festivals-under-budget');
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold">Blog post not found</h1>
        <Link href="/blog" className="text-purple-600 hover:underline mt-4 inline-block">
          Return to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white -mt-20 pt-20">
      <div className="w-full h-[50vh] relative bg-purple-900/10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${post.image || '/images/budget-festival.jpg'})`,
            filter: 'brightness(0.9)' 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Badge className="mb-4">{post.category}</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{post.author.avatar}</span>
                    <span>{post.author.name}</span>
                    {post.author.verified && (
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <h2>The Festival Budget Mindset</h2>
            <p>
              Eight years ago, I was a broke college student with an insatiable wanderlust and a deep love for music festivals. Like many, I believed these experiences were reserved for those with disposable income. As ticket prices climbed and Instagram feeds filled with luxury festival experiences, I nearly gave up on my dream of attending the world's best music events.
            </p>

            <p>
              Instead, I made a radical decision: I would find a way to experience the global festival scene without going broke. What began as a personal challenge evolved into a lifestyle and eventually this guide you're reading now. After 100+ festivals across 25 countries—all on a shoestring budget—I've developed a system that allows anyone to experience world-class events without financial ruin.
            </p>

            <h2>The $50-a-Day Festival Formula</h2>
            <p>
              The heart of my approach is the $50-a-day formula. This isn't about extreme budget measures that ruin your experience—it's about strategic planning, community engagement, and rethinking what makes a festival experience valuable. Here's the breakdown:
            </p>

            <h3>1. Ticket Strategy: The Early Bird Advantage</h3>
            <p>
              My first rule: I never pay full price for festival tickets. The typical methods—early bird purchases, volunteer positions, ambassador programs—are well-known but underutilized. What people don't realize is that combining these approaches can often result in free entry plus accommodation.
            </p>

            <p>
              For instance, at Boom Festival in Portugal, I secured early volunteer enrollment six months in advance, which provided free entry, meals, and camping. The work requirement was minimal—just 24 hours spread across a seven-day festival—leaving ample time to enjoy the event. Similar opportunities exist at nearly every major festival worldwide.
            </p>

            <h3>2. Transportation Hacks: Beyond Budget Airlines</h3>
            <p>
              While budget airlines are obvious choices for European festival-hopping, the real savings come from strategic routing and rideshare coordination. Rather than flying directly to popular festival destinations, I identify transportation hubs where I can catch cheaper connections.
            </p>

            <p>
              For example, flying to Budapest and taking a rideshare to Ozora Festival saved me over €150 compared to direct transportation. Using apps like BlaBlaCar and festival-specific Facebook rideshare groups has consistently cut my transportation costs by 40-60%.
            </p>

            <h3>3. Accommodation: Free Camping to Hostel Networks</h3>
            <p>
              Festival accommodation doesn't have to mean expensive glamping or hotels. Beyond the obvious camping options, I've developed relationships with hostel networks in festival-heavy regions. By staying at partner hostels for 3+ nights during off-peak times, I often receive festival weekend accommodations at drastically reduced rates.
            </p>

            <p>
              In festival cities like Barcelona (Primavera Sound), Berlin (Lollapalooza Berlin), and Amsterdam (ADE), I've negotiated free accommodations in exchange for creating content for hostels or organizing pre-festival events for guests.
            </p>

            <h3>4. Food & Drink: Community Cooking & Strategic Spending</h3>
            <p>
              Food costs can quickly consume a festival budget. My approach: community cooking collectives. Before major festivals, I connect with 5-10 like-minded attendees online. We pool resources, shop at local markets, and prepare meals together throughout the event.
            </p>

            <p>
              This model has worked everywhere from Glastonbury to Burning Man, not only saving money but creating lasting friendships. When I do purchase festival food, I focus spending on unique local specialties rather than generic options, making each purchase meaningful rather than merely convenient.
            </p>

            <h2>Advanced Budget Techniques</h2>

            <h3>Festival Hopping: The Multi-Event Approach</h3>
            <p>
              One of my most effective strategies is planning multi-festival trips that leverage geographical proximity and timing. For example, the European summer circuit allows you to attend 3-4 major festivals with minimal travel between events.
            </p>

            <p>
              My record was seven festivals across Spain, Portugal, and Croatia over six weeks, with total transportation costs under €300. This approach amortizes the major expense (flying to Europe) across multiple events.
            </p>

            <h3>The Skill Exchange Economy</h3>
            <p>
              Festival organizers always need specific skills. I've gained free entry by offering photography, social media management, translation services, and workshop facilitation. Even without professional credentials, most people have valuable skills that festivals need.
            </p>

            <p>
              Develop a festival-specific skill set—whether it's yoga instruction, fire performance, or DJing sunrise sets—and document your experience. This portfolio becomes your ticket to free entry at future events.
            </p>

            <h3>Building a Festival Network</h3>
            <p>
              Perhaps the most valuable long-term strategy is building a global network of festival friends. After attending multiple events in the same region, I now have couches to crash on, rideshare opportunities, and insider connections at most major festivals.
            </p>

            <p>
              These relationships have opened doors to backstage access, artist connections, and even paid opportunities within the festival industry—all while reducing costs.
            </p>

            <h2>The Psychological Aspects of Budget Festival-Going</h2>
            <p>
              Budget constraints actually enhanced my festival experiences by forcing presence and intentionality. Without endless funds for VIP upgrades or constant purchases, I focused on the music, connections, and experiences—the elements that make festivals truly transformative.
            </p>

            <p>
              This mindset shift—from consumption to contribution—changed how I approached events. Rather than asking "what can I get from this festival?" I began asking "what can I contribute?" This perspective opened doors I never imagined possible on a budget.
            </p>

            <h2>Your 2025 Budget Festival Plan</h2>
            <p>
              If you're planning to implement these strategies for the 2025 festival season, here's your timeline:
            </p>

            <ul>
              <li><strong>September 2024:</strong> Identify 3-5 target festivals and join their volunteer mailing lists and community groups.</li>
              <li><strong>October-November 2024:</strong> Apply for early volunteer positions and ambassador programs.</li>
              <li><strong>December 2024:</strong> Secure early bird tickets for any events where volunteering isn't possible.</li>
              <li><strong>January-February 2025:</strong> Book transportation during airline sales periods.</li>
              <li><strong>March-April 2025:</strong> Begin building your festival network through online communities.</li>
              <li><strong>May 2025:</strong> Organize your community cooking groups and rideshares.</li>
            </ul>

            <p>
              The world's most incredible festivals are accessible regardless of your budget. With strategic planning, community engagement, and the right mindset, you can experience transformative events while spending less than you would on an ordinary vacation.
            </p>

            <p>
              Remember: The most memorable festival experiences rarely happen in VIP sections. They happen in dusty dance floors at sunrise, in spontaneous jam sessions at campsites, and in deep conversations with strangers who become lifelong friends—all experiences that cost nothing but openness and presence.
            </p>

            <div className="mt-12 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>{post.likes} likes</span>
                </button>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{post.views} views</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} className="bg-purple-50 text-purple-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{post.author.avatar}</div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-1">
                  {post.author.name}
                  {post.author.verified && (
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  )}
                </h3>
                <p className="text-gray-600">{post.author.bio}</p>
                {post.author.socialLinks && (
                  <div className="flex items-center gap-2 mt-1">
                    {post.author.socialLinks.instagram && (
                      <a href={`https://instagram.com/${post.author.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                    {post.author.socialLinks.twitter && (
                      <a href={`https://twitter.com/${post.author.socialLinks.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-100 pt-8">
            <h3 className="text-2xl font-bold mb-6">You might also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredPosts
                .filter(relatedPost => relatedPost.slug !== post.slug)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.slug}>
                    <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${relatedPost.image || '/images/festival-default.jpg'})` }}
                      ></div>
                      <CardContent className="p-4">
                        <Badge className="mb-2">{relatedPost.category}</Badge>
                        <h4 className="text-lg font-semibold mb-2 line-clamp-2">{relatedPost.title}</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">{relatedPost.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>

          <div className="mt-12 border-t border-gray-100 pt-8">
            <Link href="/blog" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to all blog posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
