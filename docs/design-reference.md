# Design Reference

Visual and UX patterns derived from Memtime's product interface to ensure our implementation feels cohesive with their design language.

**Source:** [Memtime Product](https://www.memtime.com/how-it-works)

---

## 1. Color Palette

### Primary Colors

| Name         | Usage                                            | Suggested Value |
| ------------ | ------------------------------------------------ | --------------- |
| Navy         | Header, navigation background                    | `#1E293B`       |
| Blue Primary | Buttons, selected states, links, active elements | `#3B82F6`       |
| Blue Light   | Hover states, badges, zoom controls              | `#DBEAFE`       |

### Semantic Colors

| Name       | Usage                          | Suggested Value |
| ---------- | ------------------------------ | --------------- |
| Green      | Time entries, success states   | `#22C55E`       |
| Green Dark | Time entry text on green bg    | `#166534`       |
| Purple     | Tooltips, highlights, callouts | `#8B5CF6`       |

### Neutral Colors

| Name     | Usage                             | Suggested Value |
| -------- | --------------------------------- | --------------- |
| White    | Content area backgrounds          | `#FFFFFF`       |
| Gray 50  | Card backgrounds, subtle fills    | `#F9FAFB`       |
| Gray 100 | Borders, dividers                 | `#F3F4F6`       |
| Gray 200 | Timeline lines, secondary borders | `#E5E7EB`       |
| Gray 400 | Timestamp text, secondary text    | `#9CA3AF`       |
| Gray 600 | Body text                         | `#4B5563`       |
| Gray 900 | Headings, primary text            | `#111827`       |

---

## 2. Typography

### Font Family

- **Primary:** System font stack (Inter-like sans-serif)
- `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

### Scale

| Element        | Size    | Weight | Color                    |
| -------------- | ------- | ------ | ------------------------ |
| Page Title     | 24px    | 600    | Gray 900                 |
| Section Header | 18px    | 600    | Gray 900                 |
| Card Title     | 14-16px | 500    | Gray 900                 |
| Body Text      | 14px    | 400    | Gray 600                 |
| Timestamp      | 12-13px | 400    | Gray 400                 |
| Badge/Duration | 12-14px | 500    | Blue Primary or Gray 600 |
| Small Label    | 11-12px | 500    | Gray 400                 |

---

## 3. Layout Patterns

### App Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header (Navy background)                               │
│  [Tab Nav: Time Tracking | Project Management | ...]    │
├─────────────────────────────────────────────────────────┤
│  Toolbar: [Filters] [Zoom] [Date Nav]                   │
├─────────────────────────────────────────────────────────┤
│  Content Area (White background)                        │
│  ┌──────────┬──────────────┬──────────────┐            │
│  │ Sidebar  │   Main       │   Panel      │            │
│  │ Timeline │   Content    │   (optional) │            │
│  └──────────┴──────────────┴──────────────┘            │
└─────────────────────────────────────────────────────────┘
```

### Spacing System

- **Base unit:** 4px
- **Common values:** 8px, 12px, 16px, 24px, 32px
- **Card padding:** 12-16px
- **Section gaps:** 24px
- **Timeline row height:** ~40-48px

---

## 4. Component Patterns

### Timeline Item / Activity Card

```
┌─────────────────────────────────────────┐
│  [Icon]  Activity Name           30 min │
│          Optional description           │
└─────────────────────────────────────────┘
```

- Left-aligned app/activity icon (24x24px)
- Activity name in medium weight
- Duration badge right-aligned
- Subtle border or background on hover
- Blue border on selection

### Time Entry Card (Green variant)

```
┌─────────────────────────────────────────┐
│  Project Name                    45 min │  ← Green background
│  Description text here                  │
└─────────────────────────────────────────┘
```

- Green background (#22C55E with opacity or solid)
- White or dark green text
- Rounded corners (8px)

### Duration Badge

```
┌──────────┐
│  15 min  │  ← Blue background, white/dark text
└──────────┘
```

- Pill-shaped (full rounded)
- Small padding (4px 8px)
- Blue Primary background for active
- Gray 100 background for inactive

### Tree Node / Expandable Item

```
▶ Client Name                    [count]
  ▼ Project Name                 [count]
      Task Name
      Task Name
```

- Chevron icon for expand/collapse
- Indentation: 16-24px per level
- Subtle hover background
- Count badge for children

### Zoom Controls

```
┌─────────────────────────────────┐
│  1 min   5 min   15 min   1 h   │
└─────────────────────────────────┘
```

- Segmented button group
- Active state: Blue background
- Inactive: White/gray background
- Rounded group corners

### Pagination

```
┌─────────────────────────────────────┐
│  ← Previous    Page 1 of 5    Next →│
└─────────────────────────────────────┘
```

- Minimal design
- Disabled state for unavailable actions
- Current page indicator

---

## 5. Interactive States

### Buttons

| State     | Style                                    |
| --------- | ---------------------------------------- |
| Default   | Blue background, white text              |
| Hover     | Darker blue background                   |
| Disabled  | Gray background, gray text, no cursor    |
| Secondary | White background, blue text, blue border |

### Cards/Rows

| State    | Style                                    |
| -------- | ---------------------------------------- |
| Default  | White background                         |
| Hover    | Gray 50 background                       |
| Selected | Blue border (2px), light blue background |
| Active   | Blue left border accent                  |

### Form Inputs

| State    | Style                           |
| -------- | ------------------------------- |
| Default  | Gray 200 border                 |
| Focus    | Blue border, subtle blue shadow |
| Error    | Red border, red helper text     |
| Disabled | Gray 100 background             |

---

## 6. Iconography

- **Style:** Outlined, 2px stroke, rounded caps
- **Size:** 16px (inline), 20px (buttons), 24px (features)
- **Source suggestion:** Heroicons, Lucide, or similar

### Common Icons Needed

- Chevron right/down (tree expand/collapse)
- Clock (time entries)
- Folder (projects)
- Building (clients)
- Check (tasks)
- Plus (create new)
- Pencil (edit)
- Search (filter/search)
- Calendar (date picker)

---

## 7. Motion & Transitions

- **Duration:** 150-200ms for micro-interactions
- **Easing:** `ease-out` for expanding, `ease-in` for collapsing
- **Properties to animate:**
  - Background color on hover
  - Transform for expand/collapse
  - Opacity for fade in/out

---

## 8. Responsive Considerations

### Breakpoints

| Name    | Width      | Layout                 |
| ------- | ---------- | ---------------------- |
| Mobile  | < 640px    | Single column, stacked |
| Tablet  | 640-1024px | Two columns            |
| Desktop | > 1024px   | Full multi-column      |

### Mobile Adaptations

- Collapsible navigation
- Full-width cards
- Bottom sheet for forms
- Horizontal scroll for tables

---

## 9. Application to Our Features

### Hierarchy View

- Use tree node pattern with chevron expand/collapse
- Client/Project/Task icons for each level
- Indentation matching Memtime's style
- "Load more" as subtle link button

### Time Entries Table

- Clean table with hover states
- Duration badges for time display
- Consistent timestamp formatting
- Row click for edit navigation

### Time Entry Form

- Card-based form container
- Consistent input styling
- Green accent for time entry context
- Clear action buttons (Save/Cancel)

---

## 10. Key Takeaways

1. **Clean and professional** - No visual clutter
2. **Blue as interactive color** - Consistency in CTAs and selections
3. **Green for time entries** - Clear visual association
4. **Timeline-centric thinking** - Time is always visible context
5. **Generous whitespace** - Content breathes
6. **Subtle interactions** - Hover states, not heavy borders
7. **macOS native feel** - Familiar patterns for target users
