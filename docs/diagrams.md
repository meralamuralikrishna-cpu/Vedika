# Vedika system diagrams

These diagrams describe the current Vedika repository. They are written in Mermaid, so they render in GitHub and in Markdown tools that support Mermaid.

## Structural diagram: application architecture

```mermaid
flowchart LR
  Visitor[Visitor]
  User[Signed-in user]
  Admin[Admin]
  Guest[Share-link guest]

  subgraph Browser[React single-page application]
    Router[React Router\nApp.jsx]
    Shell[App shell\nHeader + Sidebar]
    Pages[Pages\nOverview, Studio, Templates, Designs, Moodboards, Bookings, Settings]
    Context[AppProvider\nAuth + workspace state]
    Studio[Studio components\nCanvas + library + properties]
    Helpers[Shared libraries\nexport, sharing, booking, i18n]
  end

  subgraph Supabase[Optional Supabase services]
    Auth[Supabase Auth]
    Workspace[(user_data\nprivate JSON workspace)]
    Booking[(booking_requests)]
    Shares[(shared_designs)]
    RLS[Row Level Security]
  end

  Visitor --> Router
  User --> Router
  Admin --> Router
  Guest --> Router
  Router --> Shell --> Pages
  Pages --> Context
  Pages --> Studio
  Pages --> Helpers
  Context <--> Auth
  Context <--> Workspace
  Helpers <--> Booking
  Helpers <--> Shares
  Workspace --- RLS
  Booking --- RLS
  Shares --- RLS
```

Supabase is optional configuration. Workspace records, booking requests, and share snapshots use separate database tables; authentication is handled by Supabase Auth.

## Structural diagram: domain class model

This is a conceptual UML class view of the application's data, rather than a claim that JavaScript classes are instantiated for these records. In the implementation, workspace data is held in React state and serialized to JSON.

```mermaid
classDiagram
  class User {
    +UUID id
    +String email
    +String role
  }
  class Workspace {
    +Design[] designs
    +Moodboard[] moodboards
    +Profile profile
    +String[] templateFavorites
    +String[] decoratorFavorites
    +String locale
    +String activeDesignId
  }
  class Design {
    +String id
    +String name
    +Element[] elements
    +Object settings
    +Object venuePlan
    +Boolean isFavorite
  }
  class Element {
    +String id
    +String type
    +Number x
    +Number y
    +Number width
    +Number height
    +Number rotation
    +Object properties
  }
  class Moodboard {
    +String id
    +String name
    +Object[] items
    +Boolean isFavorite
  }
  class BookingRequest {
    +UUID id
    +UUID ownerId
    +String eventType
    +Date eventDate
    +String venue
    +String status
    +String designId
  }
  class SharedDesign {
    +UUID id
    +UUID ownerId
    +String designId
    +Element[] elements
    +Object settings
    +String status
    +Comment[] comments
  }
  class Comment {
    +String text
    +String author
    +Date createdAt
  }
  class Profile {
    +String name
    +String email
    +String preferredLanguage
  }

  User "1" --> "1" Workspace : owns
  Workspace "1" o-- "0..*" Design : stores
  Workspace "1" o-- "0..*" Moodboard : stores
  Workspace "1" o-- "1" Profile : contains
  Design "1" *-- "0..*" Element : contains
  User "1" --> "0..*" BookingRequest : submits
  User "1" --> "0..*" SharedDesign : shares
  SharedDesign "1" *-- "0..*" Element : snapshots
  SharedDesign "1" o-- "0..*" Comment : receives
  BookingRequest "0..*" --> "0..1" Design : references
  SharedDesign "0..*" --> "1" Design : snapshots
```

## Behavioral diagram: use cases

```mermaid
flowchart LR
  User([User])
  Admin([Admin])
  Guest([Guest with share link])
  subgraph Vedika[ vedika application ]
    Browse([Browse templates])
    Compose([Create or edit design])
    Save([Save workspace data])
    Export([Export PNG or JSON])
    Share([Create design share link])
    Request([Submit booking request])
    Review([Confirm or decline request])
    Feedback([Comment or approve / request changes])
  end
  User --> Browse
  User --> Compose
  User --> Save
  User --> Export
  User --> Share
  User --> Request
  Admin --> Review
  Guest --> Feedback
  Compose -. includes .-> Save
  Share -. makes available .-> Feedback
```

## Behavioral diagram: share and feedback sequence

```mermaid
sequenceDiagram
  actor Owner
  participant Studio as Design Studio
  participant Context as App context
  participant Auth as Supabase Auth
  participant DB as shared_designs
  actor Guest

  Owner->>Studio: Create share link for design
  Studio->>Context: Request share snapshot
  Context->>Auth: Check signed-in session
  Auth-->>Context: Authenticated user
  Context->>DB: Insert snapshot with owner and UUID
  DB-->>Context: Saved share record
  Context-->>Studio: Return /share/{shareId}
  Guest->>DB: Open link and read snapshot
  DB-->>Guest: Design snapshot and current feedback
  Guest->>DB: Submit comment or status
  DB-->>Guest: Updated feedback
```

## Behavioral diagram: design editing activity

```mermaid
flowchart TD
  Start([Start]) --> Open[Open Design Studio]
  Open --> Source{Choose starting point}
  Source -->|Blank canvas| Canvas[Open empty canvas]
  Source -->|Template| Load[Load starter layout]
  Load --> Canvas
  Canvas --> Add[Add decoration element]
  Add --> Adjust[Move, resize, rotate, or change properties]
  Adjust --> More{Continue editing?}
  More -->|Yes| Add
  More -->|No| Save{Save or export?}
  Save -->|Save| Persist[Save design to workspace when signed in]
  Save -->|Export| File[Export PNG or JSON]
  Persist --> Share{Share for feedback?}
  File --> Share
  Share -->|Yes| Link[Create share link]
  Share -->|No| End([Finish])
  Link --> End
```

## Development lifecycle diagram

The repository does not encode a formal SDLC process. This diagram is a practical lifecycle for maintaining and extending the current project; the implementation and review stages should be repeated as features change.

```mermaid
flowchart LR
  Requirements[Gather user and project requirements] --> Design[Plan UI, data model, and access rules]
  Design --> Implement[Implement React pages, components, and Supabase changes]
  Implement --> Verify[Review behavior, permissions, and production build]
  Verify -->|Issues found| Implement
  Verify -->|Ready| Release[Deploy frontend and apply database changes]
  Release --> Maintain[Monitor, fix issues, and gather feedback]
  Maintain --> Requirements
```

## Development class diagram

The following class-style view maps the major source modules and their dependencies. The project uses React function components and hooks, so the boxes represent modules/components rather than object-oriented classes.

```mermaid
classDiagram
  class App {
    +composeProvidersAndRoutes()
  }
  class AppProvider {
    +manageAuthAndWorkspaceState()
    +saveDesign(design)
    +saveMoodboard(moodboard)
    +saveBooking(booking)
  }
  class AppShell {
    +renderSharedNavigation()
  }
  class DesignStudio {
    +editActiveDesign()
    +exportCanvas()
  }
  class DesignCanvas {
    +renderElements()
    +handleSelectionAndTransforms()
  }
  class ElementLibrary {
    +provideReusableElements()
  }
  class PropertiesPanel {
    +editSelectedElement()
  }
  class SupabaseClient {
    +manageAuthSession()
    +accessDatabase()
  }
  class BookingRequests {
    +createRequest()
    +listRequests()
    +updateStatus()
  }

  App --> AppProvider : wraps
  App --> AppShell : routes pages through
  App --> DesignStudio : routes to
  DesignStudio --> AppProvider : reads and updates state
  DesignStudio *-- DesignCanvas : renders
  DesignStudio *-- ElementLibrary : uses
  DesignStudio *-- PropertiesPanel : uses
  AppProvider --> SupabaseClient : auth and workspace persistence
  AppProvider --> BookingRequests : booking operations
```
