# Farcaster TweetDeck + Typefully Web App

## Background and Motivation
The client wants to build a web app that combines TweetDeck-like functionality (multiple column customized views) with Typefully-like features (post scheduling) for Farcaster. The goal is to create a seamless experience that reduces the friction of switching between Farcaster (via Warpcast) and X/Twitter.

Farcaster is a sufficiently decentralized social network protocol where the underlying social graph is stored on a blockchain (currently Optimism), but the protocol itself is not a blockchain. This decentralized nature allows multiple clients to access the same social graph, enabling users to switch between clients without losing their connections.

## Key Challenges and Analysis
1. **Farcaster API Integration** - Need to understand and implement Farcaster's protocol APIs
   - Hubble API for accessing Farcaster data (provides real-time access to the Farcaster network)
   - AuthKit for authentication (React toolkit for Sign In with Farcaster)
   - Understanding message types (casts, reactions, etc.)

2. **User Authentication** 
   - Implement "Sign in with Farcaster" using AuthKit
   - Handle user permissions for reading/writing to Farcaster
   - Consider using thirdweb's SIWF integration for easier auth implementation

3. **Multiple Column View**
   - Design flexible layout system for TweetDeck-like experience
   - Create customizable column types (home feed, user profiles, notifications, etc.)
   - Support responsive design for different screen sizes
   - Implement drag-and-drop for column reordering

4. **Post Scheduling**
   - Create draft management system with database storage
   - Implement scheduling mechanism with background jobs
   - Handle media uploads and storage
   - Account for Farcaster's rate limits and API constraints
   - Look at existing solutions like Ketchup for inspiration

5. **Real-time Updates**
   - Implement real-time feed updates using Hubble's streaming capabilities
   - Ensure efficient data fetching and caching strategies
   - Consider using websockets for live updates

## Data Models and State Management

To effectively manage our application's data, we need to define clear data models and implement state management. Here's our approach:

### Core Data Models

1. **User Model**
```typescript
interface User {
  id: string;        // Farcaster user ID
  username: string;  // Farcaster username
  displayName: string;
  profileImageUrl: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
}
```

2. **Cast (Post) Model**
```typescript
interface Cast {
  id: string;            // Unique cast hash
  text: string;          // Content of the cast
  author: User;          // User who created the cast
  timestamp: number;     // Unix timestamp
  replyTo?: string;      // Parent cast ID if this is a reply
  recastCount: number;   // Number of recasts
  likeCount: number;     // Number of likes
  replyCount: number;    // Number of replies
  hasLiked: boolean;     // If current user has liked this cast
  hasRecasted: boolean;  // If current user has recasted
  embeds?: Embed[];      // Array of media embeds (images, links, etc.)
  mentions?: User[];     // Users mentioned in the cast
}
```

3. **Embed Model**
```typescript
interface Embed {
  type: 'image' | 'link' | 'cast' | 'nft';
  url: string;
  previewImageUrl?: string;
  title?: string;
  description?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}
```

4. **Draft Model**
```typescript
interface Draft {
  id: string;         // Local draft ID
  text: string;       // Content of the draft
  embeds?: Embed[];   // Array of media embeds
  createdAt: number;  // When draft was created
  updatedAt: number;  // When draft was last updated
  scheduledFor?: Date; // When to publish (if scheduled)
  inReplyTo?: string; // Parent cast ID if this is a reply
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}
```

5. **Column Configuration Model**
```typescript
interface ColumnConfig {
  id: string;
  type: 'home' | 'user' | 'search' | 'notifications' | 'bookmarks';
  title: string;
  params?: {
    username?: string;
    searchQuery?: string;
  };
  width: number; // Flex units for column width
  position: number; // Order in the layout
  settings: {
    showReplies: boolean;
    showReposts: boolean;
    autoRefresh: boolean;
    refreshInterval?: number;
  };
}
```

### State Management

We'll use a combination of client-side state management tools:

1. **Global State Management**: 
   - Use [Zustand](https://github.com/pmndrs/zustand) for lightweight global state management
   - Manage user authentication, app settings, and column configurations

```typescript
// Example Zustand store for column management
interface ColumnsState {
  columns: ColumnConfig[];
  addColumn: (config: Omit<ColumnConfig, 'id' | 'position'>) => void;
  removeColumn: (id: string) => void;
  reorderColumns: (startIndex: number, endIndex: number) => void;
  updateColumnSettings: (id: string, settings: Partial<ColumnConfig['settings']>) => void;
}

const useColumnsStore = create<ColumnsState>((set) => ({
  columns: [],
  addColumn: (config) => set((state) => ({
    columns: [...state.columns, {
      ...config,
      id: nanoid(),
      position: state.columns.length,
    }],
  })),
  removeColumn: (id) => set((state) => ({
    columns: state.columns.filter(col => col.id !== id),
  })),
  reorderColumns: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.columns);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    // Update positions
    return {
      columns: result.map((col, idx) => ({
        ...col,
        position: idx,
      })),
    };
  }),
  updateColumnSettings: (id, settings) => set((state) => ({
    columns: state.columns.map(col => 
      col.id === id 
        ? { ...col, settings: { ...col.settings, ...settings } } 
        : col
    ),
  })),
}));
```

2. **Server State Management**:
   - Use [React Query](https://tanstack.com/query/latest) for data fetching, caching, and synchronization
   - Manage API requests to Farcaster and handle real-time updates

```typescript
// Example React Query hooks
export function useUserFeed(username: string, options = {}) {
  return useQuery({
    queryKey: ['feed', 'user', username],
    queryFn: () => farcasterApi.getUserFeed(username),
    ...options,
  });
}

export function useHomeFeed(options = {}) {
  return useQuery({
    queryKey: ['feed', 'home'],
    queryFn: () => farcasterApi.getHomeFeed(),
    ...options,
  });
}

export function useCast(id: string, options = {}) {
  return useQuery({
    queryKey: ['cast', id],
    queryFn: () => farcasterApi.getCast(id),
    ...options,
  });
}
```

3. **Form State Management**:
   - Use [React Hook Form](https://react-hook-form.com/) for managing form state and validation
   - Handle post creation, drafts, and scheduling forms

4. **Persistence**:
   - Store user preferences and column configurations in localStorage
   - Store drafts and scheduled posts in database (PostgreSQL)
   - Use IndexedDB via [idb-keyval](https://github.com/jakearchibald/idb-keyval) for larger client-side storage needs

```typescript
// Example persistence utility for columns
const COLUMNS_STORAGE_KEY = 'farcaster-deck-columns';

export const columnsStorage = {
  saveColumns: (columns: ColumnConfig[]) => {
    localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columns));
  },
  
  loadColumns: (): ColumnConfig[] => {
    const stored = localStorage.getItem(COLUMNS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },
};

// Initialize Zustand store with persisted data
const useColumnsStore = create<ColumnsState>(
  persist(
    (set) => ({
      columns: [],
      // ... other methods
    }),
    {
      name: COLUMNS_STORAGE_KEY,
    }
  )
);
```

### API Layer

We'll create a service layer to abstract Farcaster API interactions:

```typescript
// src/services/farcasterApi.ts
class FarcasterApi {
  constructor(private apiClient) {}
  
  // Feed-related methods
  async getHomeFeed() {
    return this.apiClient.get('/feed/home');
  }
  
  async getUserFeed(username: string) {
    return this.apiClient.get(`/feed/user/${username}`);
  }
  
  // Cast-related methods
  async getCast(id: string) {
    return this.apiClient.get(`/cast/${id}`);
  }
  
  async createCast(text: string, options: { replyTo?: string, embeds?: Embed[] }) {
    return this.apiClient.post('/cast', { text, ...options });
  }
  
  async likeCast(id: string) {
    return this.apiClient.post(`/cast/${id}/like`);
  }
  
  async unlikeCast(id: string) {
    return this.apiClient.delete(`/cast/${id}/like`);
  }
  
  // User-related methods
  async searchUsers(query: string) {
    return this.apiClient.get(`/users/search?q=${encodeURIComponent(query)}`);
  }
  
  async getUserProfile(username: string) {
    return this.apiClient.get(`/users/${username}`);
  }
}

// Initialize with either Neynar or direct Hubble API
export const farcasterApi = new FarcasterApi(
  process.env.NEXT_PUBLIC_USE_NEYNAR === 'true'
    ? new NeynarApiClient(process.env.NEXT_PUBLIC_NEYNAR_API_KEY)
    : new HubbleApiClient()
);
```

## Multi-Column Layout Implementation
After researching various approaches for implementing TweetDeck-like multi-column layouts, we've identified the following implementation strategy:

### Layout Structure
1. **Container Grid Layout**:
   - Use Tailwind CSS's grid system for the main container: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
   - This provides responsive behavior, showing 1 column on mobile, 2 on tablets, 3 on laptops, and 4 on larger screens

2. **Column Component**:
   - Each column will be a separate component with its own state and functionality
   - Basic structure: `<div className="flex flex-col h-full overflow-hidden border rounded-lg">`
   - Column header: `<div className="p-3 font-bold border-b flex justify-between items-center">`
   - Column content: `<div className="flex-1 overflow-y-auto">`

3. **Virtual Scrolling**:
   - To handle potentially large number of posts in each column, implement virtual scrolling
   - Consider using libraries like `react-window` or `react-virtualized` to render only visible items

### Column Management
1. **Column Configuration**:
   ```typescript
   interface ColumnConfig {
     id: string;
     type: 'home' | 'user' | 'search' | 'notifications' | 'bookmarks';
     title: string;
     params?: {
       username?: string;
       searchQuery?: string;
     };
     width: number; // Flex units
   }
   ```

2. **User Customization**:
   - Allow adding/removing columns
   - Enable column reordering via drag-and-drop (using libraries like `react-beautiful-dnd`)
   - Store user preferences in database or localStorage

3. **Column Types**:
   - Home feed: Shows the user's main feed
   - User feed: Shows posts from a specific user
   - Search results: Shows posts matching a search query
   - Notifications: Shows user's notifications
   - Bookmarks: Shows saved/bookmarked posts

### Performance Considerations
1. **Lazy Loading**:
   - Load data for each column independently
   - Initialize with only visible columns, lazy-load others as needed

2. **Optimized Rendering**:
   - Use React.memo for components to prevent unnecessary re-renders
   - Implement debouncing for scroll events
   - Consider using `requestAnimationFrame` for smooth animations

3. **Efficient Data Fetching**:
   - Use SWR or React Query for data fetching with caching
   - Implement pagination or infinite scrolling in each column
   - Set up independent loading states for each column

### Responsive Design
1. **Mobile Experience**:
   - Single column view on small screens
   - Swipeable interface between columns
   - Collapsible sidebar for column navigation

2. **Desktop Experience**:
   - Multi-column view with customizable widths
   - Fixed header with scrollable content
   - Keyboard shortcuts for navigation

### Example Column Implementation
```jsx
// Column.tsx
const Column = ({ config, onRemove }) => {
  const { data, error, isLoading } = useFarcasterData(config);
  
  return (
    <div className="flex flex-col h-full overflow-hidden border rounded-lg">
      <div className="p-3 font-bold border-b flex justify-between items-center">
        <h2>{config.title}</h2>
        <button onClick={() => onRemove(config.id)}>×</button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage error={error} />}
        {data && data.map(item => (
          <PostCard key={item.id} post={item} />
        ))}
      </div>
    </div>
  );
};
```

## Existing Solutions Analysis
For our implementation, we can learn from existing solutions in the social media management and scheduling space:

### Farcaster-specific Tools
1. **Ketchup** - Provides analytics, publishing, and scheduling for Farcaster casts
2. **string-poaster** - A command-line utility that can post to multiple platforms including Farcaster

### Other Post Scheduling Tools (for inspiration)
1. **Typefully** - Popular thread writing and scheduling tool for Twitter
2. **Buffer** - Multi-platform social media scheduling
3. **FediPost** - A Fediverse post scheduler that uses builtin scheduling functionality
4. **ThreadStart** - Specifically designed for Twitter thread scheduling

### TweetDeck-like Implementations (for UI reference)
1. **Spool** - A TweetDeck-like client for Threads.com by Meta
2. **Static Tweets Tailwind** - A library providing static tweet rendering with Tailwind styling
3. **Twitter Clone Next** - A Next.js Twitter clone using multi-column layout

### Key Features to Implement
Based on these existing tools, our scheduling functionality should include:
- Draft saving and organization
- Calendar view for scheduled posts
- Analytics for post performance
- Media attachment support
- Thread creation and scheduling
- Queue management
- Timezone handling
- Post preview

## Technology Stack Selection
After research, the recommended tech stack for this application is:

1. **Frontend Framework**: Next.js with React - Provides robust client and server-side capabilities and works well with Farcaster's AuthKit
2. **Authentication**: Farcaster AuthKit - Official React toolkit for Sign In with Farcaster (SIWF)
3. **API Integration**: 
   - Use Neynar API as a managed service for easier integration
   - OR connect directly to a Hubble instance for more control
4. **Database**: PostgreSQL for storing user preferences, draft posts, and scheduling data
5. **Hosting**: Vercel for Next.js deployment
6. **Real-time**: Implement real-time updates with WebSockets or Server-Sent Events
7. **Styling**: Tailwind CSS for responsive design
8. **Background Jobs**: Use a job scheduler like Bull with Redis for handling scheduled posts
9. **DnD**: react-beautiful-dnd for drag-and-drop column management
10. **State Management**: Zustand for global state, React Query for server state
11. **Form Management**: React Hook Form for form handling and validation 