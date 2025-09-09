# FestiWise Blog Analytics Events Implementation

This document describes the GA4 events implemented for the FestiWise blog to track user engagement and conversions.

## Event List

### User Interaction Events

| Event Name | Trigger | Parameters | Description |
|------------|---------|------------|-------------|
| `click_take_quiz` | User clicks a "Take Quiz" button | `page_section`, `device` | Tracks when users click to take the festival recommendation quiz |
| `click_read_full_story` | User clicks on "Read Full Story" | `page_section`, `post_id`, `tag_list` | Tracks when users click to read a complete blog post |
| `subscribe_start` | User starts interacting with newsletter form | `page_section`, `device` | Tracks the start of newsletter subscription process |
| `subscribe_success` | User successfully subscribes to newsletter | `page_section`, `device` | Tracks successful newsletter subscriptions |
| `filter_change` | User changes category/sort/tag filters | `page_section`, `filter_type`, `value` | Tracks filter usage on the blog page |
| `share_click` | User clicks share button | `page_section`, `method` | Tracks sharing actions |

### Common Parameters

- `page_section`: The section of the page where the event occurred (e.g., 'blog', 'blog_post_card', 'blog_post_content')
- `post_id`: The unique identifier (slug) of the blog post
- `tag_list`: Comma-separated list of tags associated with the post
- `device`: The device type (mobile, tablet, desktop)
- `filter_type`: For filter_change events, indicates whether it's 'category', 'tag', or 'sort'
- `value`: The selected value of the filter
- `method`: For share events, the sharing method used (e.g., 'WhatsApp', 'Twitter', 'copy')

## Implementation Details

The events are implemented using the analytics-tracker.ts module, which handles sending events to GA4 and other configured analytics platforms. The blog page components use these tracking functions through the `useAnalyticsTracker` hook.

## Usage Examples

```typescript
// Track quiz button clicks
trackTakeQuiz('blog_post_content');

// Track read more clicks
trackReadFullStory(post.slug, post.tags);

// Track filter changes
trackFilterChange('category', 'Electronic');

// Track sharing
trackShareClick('WhatsApp');

// Track newsletter subscriptions
trackSubscribeStart('blog');
trackSubscribeSuccess('blog');
```

## Reporting

These events can be found in the GA4 dashboard under Events. Custom segments and audiences can be created based on these events to analyze user behavior patterns and optimize conversion flows.
