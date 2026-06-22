export const INITIAL_BOARD_DATA = {
  columns: {
    'col-backlog': {
      id: 'col-backlog',
      title: 'Backlog',
      color: '#a1a1aa', // zinc
      cardIds: ['task-1', 'task-2']
    },
    'col-todo': {
      id: 'col-todo',
      title: 'To Do',
      color: '#3b82f6', // blue
      cardIds: ['task-3', 'task-4']
    },
    'col-progress': {
      id: 'col-progress',
      title: 'In Progress',
      color: '#eab308', // yellow
      cardIds: ['task-5']
    },
    'col-review': {
      id: 'col-review',
      title: 'Review',
      color: '#a855f7', // purple
      cardIds: ['task-6']
    },
    'col-done': {
      id: 'col-done',
      title: 'Completed',
      color: '#22c55e', // green
      cardIds: ['task-7']
    }
  },
  cards: {
    'task-1': {
      id: 'task-1',
      title: 'Research API Authentication options',
      description: 'Investigate OAuth2, JWT, and Auth0 for secure API endpoints. Compare ease of integration, cost, and maintenance.',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days from now
      assignees: ['JD', 'AM'],
      checklist: [
        { id: 'sub-1-1', text: 'Read Auth0 documentation', completed: true },
        { id: 'sub-1-2', text: 'Create comparison matrix', completed: false },
        { id: 'sub-1-3', text: 'Present recommendations to lead', completed: false }
      ],
      comments: [
        { id: 'c1', author: 'John Doe', text: 'JWT might be the simplest since we don\'t have budget for Auth0 yet.', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() }
      ],
      activity: [
        { id: 'act-1', text: 'Card created', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() }
      ]
    },
    'task-2': {
      id: 'task-2',
      title: 'Draft landing page copy',
      description: 'Write marketing copy for the main page. Focus on value propositions, quick onboarding, and call-to-actions.',
      priority: 'low',
      dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // Overdue by 2 days
      assignees: ['EM'],
      checklist: [
        { id: 'sub-2-1', text: 'Draft hero section text', completed: true },
        { id: 'sub-2-2', text: 'Draft feature highlights', completed: true },
        { id: 'sub-2-3', text: 'Write FAQ section', completed: false }
      ],
      comments: [],
      activity: [
        { id: 'act-2', text: 'Card created', timestamp: new Date(Date.now() - 3600000 * 48).toISOString() }
      ]
    },
    'task-3': {
      id: 'task-3',
      title: 'Design high-fidelity mockups',
      description: 'Create Figma designs for the board and analytics views. Use modern glassmorphism aesthetics.',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0], // Tomorrow
      assignees: ['PA', 'JD'],
      checklist: [
        { id: 'sub-3-1', text: 'Establish color palette and typography', completed: true },
        { id: 'sub-3-2', text: 'Design Board Grid view', completed: false },
        { id: 'sub-3-3', text: 'Design Card Details dialog', completed: false },
        { id: 'sub-3-4', text: 'Design Stats overlay', completed: false }
      ],
      comments: [
        { id: 'c2', author: 'Pandu', text: 'Going with Outfit for headings and Inter for body text. Let\'s keep it sleek.', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() }
      ],
      activity: [
        { id: 'act-3', text: 'Card created', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() }
      ]
    },
    'task-4': {
      id: 'task-4',
      title: 'Set up database schema',
      description: 'Define relational models for Users, Boards, Columns, and Cards. Draft migration scripts.',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      assignees: ['AM'],
      checklist: [],
      comments: [],
      activity: [
        { id: 'act-4', text: 'Card created', timestamp: new Date(Date.now() - 3600000 * 6).toISOString() }
      ]
    },
    'task-5': {
      id: 'task-5',
      title: 'Implement drag-and-drop core logic',
      description: 'Integrate native HTML5 Drag and Drop events inside the Column and Card components. Support item reordering.',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0], // Due today
      assignees: ['PA'],
      checklist: [
        { id: 'sub-5-1', text: 'Configure card dragStart and dragEnd events', completed: true },
        { id: 'sub-5-2', text: 'Setup column dragOver and drop targets', completed: true },
        { id: 'sub-5-3', text: 'Implement list re-ordering algorithms', completed: false },
        { id: 'sub-5-4', text: 'Add drop visual indicators', completed: false }
      ],
      comments: [
        { id: 'c3', author: 'Pandu', text: 'HTML5 drag events work perfectly. Added visual dropping lines to make it clear.', timestamp: new Date(Date.now() - 1800000).toISOString() }
      ],
      activity: [
        { id: 'act-5', text: 'Moved to In Progress', timestamp: new Date(Date.now() - 3600000 * 3).toISOString() }
      ]
    },
    'task-6': {
      id: 'task-6',
      title: 'Refactor state persistence',
      description: 'Sync the complete board, column, card, and log data to LocalStorage. Create custom hook for handling storage.',
      priority: 'low',
      dueDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
      assignees: ['JD'],
      checklist: [
        { id: 'sub-6-1', text: 'Write useLocalStorage hook', completed: true },
        { id: 'sub-6-2', text: 'Integrate hook into App level state', completed: true }
      ],
      comments: [],
      activity: [
        { id: 'act-6', text: 'Sent to Lead for review', timestamp: new Date(Date.now() - 3600000).toISOString() }
      ]
    },
    'task-7': {
      id: 'task-7',
      title: 'Initialize repository structure',
      description: 'Scaffold the project using Vite React template. Set up basic directory structure and install lucide-react.',
      priority: 'medium',
      dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      assignees: ['PA'],
      checklist: [
        { id: 'sub-7-1', text: 'Run create-vite', completed: true },
        { id: 'sub-7-2', text: 'Clean up starter code', completed: true },
        { id: 'sub-7-3', text: 'Install icons and fonts', completed: true }
      ],
      comments: [],
      activity: [
        { id: 'act-7', text: 'Completed scaffolding', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() }
      ]
    }
  },
  columnOrder: ['col-backlog', 'col-todo', 'col-progress', 'col-review', 'col-done']
};

export const AVAILABLE_BACKGROUNDS = [
  { id: 'bg-glass-dark', name: 'Midnight Eclipse', style: 'radial-gradient(circle at top left, #0f172a, #020617, #090d16)' },
  { id: 'bg-aurora', name: 'Northern Aurora', style: 'linear-gradient(135deg, #0f172a 20%, #111827 40%, #064e3b 80%, #022c22 100%)' },
  { id: 'bg-nebula', name: 'Deep Nebula', style: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 30%, #311042 70%, #030712 100%)' },
  { id: 'bg-sunset', name: 'Cyberpunk Sunset', style: 'linear-gradient(135deg, #0f172a 30%, #4c1d95 60%, #831843 85%, #500724 100%)' },
  { id: 'bg-ocean', name: 'Deep Oceanic', style: 'linear-gradient(135deg, #020617 0%, #0c4a6e 40%, #032b45 75%, #0f172a 100%)' },
  { id: 'bg-solid-slate', name: 'Sleek Charcoal', style: '#0b0f19' }
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  { value: 'medium', label: 'Medium', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
  { value: 'high', label: 'High', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' }
];

export const TEAM_MEMBERS = [
  { id: 'PA', name: 'Pandu', avatarColor: '#10b981', initials: 'PA' },
  { id: 'JD', name: 'John Doe', avatarColor: '#3b82f6', initials: 'JD' },
  { id: 'AM', name: 'Alice Miller', avatarColor: '#ec4899', initials: 'AM' },
  { id: 'EM', name: 'Eric Mason', avatarColor: '#f59e0b', initials: 'EM' }
];
