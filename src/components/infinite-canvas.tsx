'use client'

import type React from 'react'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import {
	Mic,
	Search,
	Filter,
	X,
	Calendar,
	CheckSquare,
	Plus,
	ZoomIn,
	ZoomOut,
	Maximize2,
	Edit2,
	Camera,
	MessageCircle,
	FileText,
	Lock,
} from 'lucide-react'
import CommentDialog from '~/components/comment-dialog'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'

interface TaskItem {
	id: string
	text: string
	status: 'To do' | 'Doing' | 'Reviewing' | 'Done'
	createdAt: Date
	keywords?: string[]
}

interface Task {
	id: string
	text: string
	completed: boolean
	createdAt: Date
	priority: 'low' | 'medium' | 'high' | 'Critical'
	parentItem?: CanvasItemData
	status?: TaskItem['status']
	keywords?: string[]
	assignee?: string
	type?: string
}

interface CanvasItemData {
	id: string
	type: 'voice' | 'image' | 'text' | 'link'
	x: number
	y: number
	content: string
	caption?: string
	comments: Comment[]
	duration?: number
	isPlaying?: boolean
	keywords?: string[]
	timestamp: Date
	julianNotes?: string
	author: string
	taskItems: TaskItem[]
	isPrivate?: boolean
	imageFile?: File | null
	url?: string
}

interface Comment {
	id: string
	author: string
	text: string
	timestamp: Date
}

const mockItems: CanvasItemData[] = [
	// Day 1 - January 15 (Dense day with 35+ items)
	{
		id: '1',
		type: 'voice',
		x: 200,
		y: 150,
		content: 'voice-note-1.mp3',
		caption: 'Team meeting notes from Monday',
		duration: 45,
		keywords: ['meeting', 'action items', 'budget', 'timeline', 'team'],
		timestamp: new Date('2024-01-15T09:00:00'),
		julianNotes: 'Need to follow up on the budget approval process',
		author: 'Julian',
		taskItems: [
			{
				id: 't1',
				text: 'Follow up on budget',
				status: 'To do',
				createdAt: new Date('2024-01-15T09:30:00'),
			},
			{
				id: 't2',
				text: 'Schedule next meeting',
				status: 'Done',
				createdAt: new Date('2024-01-15T09:45:00'),
			},
		],
		comments: [
			{
				id: 'c1',
				author: 'Sarah',
				text: 'Great summary of the action items!',
				timestamp: new Date('2024-01-15T10:30:00'),
			},
			{
				id: 'c2',
				author: 'Mike',
				text: 'Can we follow up on the budget discussion?',
				timestamp: new Date('2024-01-15T11:15:00'),
			},
			{
				id: 'c3',
				author: 'Alex',
				text: "I'll prepare the financial projections",
				timestamp: new Date('2024-01-15T11:30:00'),
			},
			{
				id: 'c4',
				author: 'Emma',
				text: 'Should we include Q2 targets?',
				timestamp: new Date('2024-01-15T12:00:00'),
			},
			{
				id: 'c5',
				author: 'David',
				text: 'Yes, definitely include Q2',
				timestamp: new Date('2024-01-15T12:15:00'),
			},
			{
				id: 'c6',
				author: 'Lisa',
				text: 'I can help with the presentation',
				timestamp: new Date('2024-01-15T12:30:00'),
			},
			{
				id: 'c7',
				author: 'Tom',
				text: 'Great idea, Lisa!',
				timestamp: new Date('2024-01-15T12:45:00'),
			},
			{
				id: 'c8',
				author: 'Sarah',
				text: "Let's schedule a follow-up",
				timestamp: new Date('2024-01-15T13:00:00'),
			},
		],
	},
	{
		id: '2',
		type: 'image',
		x: 500,
		y: 200,
		content: '/design-mockup-wireframe.jpg',
		caption: 'Initial wireframe for the new feature',
		timestamp: new Date('2024-01-15T13:30:00'),
		julianNotes: 'Consider mobile-first approach for this design',
		author: 'Alex',
		comments: [
			{
				id: 'c9',
				author: 'Julian',
				text: 'Love the clean layout approach',
				timestamp: new Date('2024-01-15T14:00:00'),
			},
			{
				id: 'c10',
				author: 'Mike',
				text: 'How does this work on mobile?',
				timestamp: new Date('2024-01-15T14:15:00'),
			},
			{
				id: 'c11',
				author: 'Alex',
				text: "I'll create mobile versions next",
				timestamp: new Date('2024-01-15T14:30:00'),
			},
			{
				id: 'c12',
				author: 'Emma',
				text: 'The color scheme looks great',
				timestamp: new Date('2024-01-15T14:45:00'),
			},
			{
				id: 'c13',
				author: 'David',
				text: 'Can we add more contrast?',
				timestamp: new Date('2024-01-15T15:00:00'),
			},
			{
				id: 'c14',
				author: 'Lisa',
				text: 'I agree with David on contrast',
				timestamp: new Date('2024-01-15T15:15:00'),
			},
			{
				id: 'c15',
				author: 'Tom',
				text: 'What about accessibility?',
				timestamp: new Date('2024-01-15T15:30:00'),
			},
			{
				id: 'c16',
				author: 'Sarah',
				text: 'Good point, Tom',
				timestamp: new Date('2024-01-15T15:45:00'),
			},
		],
	},
	{
		id: '3',
		type: 'text',
		x: 300,
		y: 400,
		content:
			'Key insights from user research:\n- Users prefer simplified navigation\n- Mobile usage is increasing\n- Need better onboarding flow',
		timestamp: new Date('2024-01-15T16:00:00'),
		author: 'Emma',
		comments: [
			{
				id: 'c17',
				author: 'Julian',
				text: 'This aligns with our analytics',
				timestamp: new Date('2024-01-15T16:15:00'),
			},
			{
				id: 'c18',
				author: 'Mike',
				text: 'Should we prioritize mobile?',
				timestamp: new Date('2024-01-15T16:30:00'),
			},
			{
				id: 'c19',
				author: 'Alex',
				text: 'Definitely mobile-first',
				timestamp: new Date('2024-01-15T16:45:00'),
			},
			{
				id: 'c20',
				author: 'David',
				text: 'What about the onboarding flow?',
				timestamp: new Date('2024-01-15T17:00:00'),
			},
			{
				id: 'c21',
				author: 'Lisa',
				text: 'I can design new onboarding',
				timestamp: new Date('2024-01-15T17:15:00'),
			},
			{
				id: 'c22',
				author: 'Tom',
				text: "Let's A/B test different flows",
				timestamp: new Date('2024-01-15T17:30:00'),
			},
			{
				id: 'c23',
				author: 'Sarah',
				text: 'Great research, Emma!',
				timestamp: new Date('2024-01-15T17:45:00'),
			},
			{
				id: 'c24',
				author: 'Emma',
				text: 'Thanks everyone for the feedback',
				timestamp: new Date('2024-01-15T18:00:00'),
			},
		],
	},

	// Day 2 - January 16 (Another dense day)
	{
		id: '4',
		type: 'voice',
		x: 200,
		y: 150,
		content: 'voice-note-2.mp3',
		caption: 'Client feedback session recording',
		duration: 120,
		keywords: ['client', 'feedback', 'improvements', 'timeline'],
		timestamp: new Date('2024-01-16T09:00:00'),
		author: 'Sarah',
		comments: [
			{
				id: 'c25',
				author: 'Julian',
				text: 'Valuable client insights here',
				timestamp: new Date('2024-01-16T09:30:00'),
			},
			{
				id: 'c26',
				author: 'Mike',
				text: 'They seem happy with progress',
				timestamp: new Date('2024-01-16T09:45:00'),
			},
			{
				id: 'c27',
				author: 'Alex',
				text: 'Should we implement their suggestions?',
				timestamp: new Date('2024-01-16T10:00:00'),
			},
			{
				id: 'c28',
				author: 'Emma',
				text: 'Most suggestions are feasible',
				timestamp: new Date('2024-01-16T10:15:00'),
			},
			{
				id: 'c29',
				author: 'David',
				text: "What's the timeline impact?",
				timestamp: new Date('2024-01-16T10:30:00'),
			},
			{
				id: 'c30',
				author: 'Lisa',
				text: 'Minimal impact if we prioritize',
				timestamp: new Date('2024-01-16T10:45:00'),
			},
			{
				id: 'c31',
				author: 'Tom',
				text: "Let's create action items",
				timestamp: new Date('2024-01-16T11:00:00'),
			},
			{
				id: 'c32',
				author: 'Sarah',
				text: "I'll draft the action plan",
				timestamp: new Date('2024-01-16T11:15:00'),
			},
		],
	},
	{
		id: '5',
		type: 'image',
		x: 400,
		y: 250,
		content: '/user-interface-mobile-app.jpg',
		caption: 'Mobile app interface concepts',
		timestamp: new Date('2024-01-16T14:00:00'),
		author: 'Lisa',
		comments: [
			{
				id: 'c33',
				author: 'Julian',
				text: 'The mobile design looks fantastic',
				timestamp: new Date('2024-01-16T14:15:00'),
			},
			{
				id: 'c34',
				author: 'Mike',
				text: 'How does navigation work?',
				timestamp: new Date('2024-01-16T14:30:00'),
			},
			{
				id: 'c35',
				author: 'Alex',
				text: 'Clean and intuitive interface',
				timestamp: new Date('2024-01-16T14:45:00'),
			},
			{
				id: 'c36',
				author: 'Emma',
				text: 'Users will love this design',
				timestamp: new Date('2024-01-16T15:00:00'),
			},
			{
				id: 'c37',
				author: 'David',
				text: 'What about dark mode?',
				timestamp: new Date('2024-01-16T15:15:00'),
			},
			{
				id: 'c38',
				author: 'Lisa',
				text: 'Dark mode is in progress',
				timestamp: new Date('2024-01-16T15:30:00'),
			},
			{
				id: 'c39',
				author: 'Tom',
				text: "Can't wait to see dark mode",
				timestamp: new Date('2024-01-16T15:45:00'),
			},
			{
				id: 'c40',
				author: 'Sarah',
				text: 'Excellent work, Lisa!',
				timestamp: new Date('2024-01-16T16:00:00'),
			},
		],
	},

	// Day 3 - January 17 (Dense day with 40+ items)
	{
		id: '6',
		type: 'text',
		x: 300,
		y: 300,
		content:
			'Sprint planning notes:\n- 15 story points committed\n- Focus on mobile optimization\n- Testing framework setup',
		timestamp: new Date('2024-01-17T09:00:00'),
		author: 'Mike',
		comments: [
			{
				id: 'c41',
				author: 'Julian',
				text: 'Realistic sprint goals',
				timestamp: new Date('2024-01-17T09:15:00'),
			},
			{
				id: 'c42',
				author: 'Sarah',
				text: 'Mobile optimization is priority',
				timestamp: new Date('2024-01-17T09:30:00'),
			},
			{
				id: 'c43',
				author: 'Alex',
				text: "I'll handle the testing framework",
				timestamp: new Date('2024-01-17T09:45:00'),
			},
			{
				id: 'c44',
				author: 'Emma',
				text: 'What testing tools are we using?',
				timestamp: new Date('2024-01-17T10:00:00'),
			},
			{
				id: 'c45',
				author: 'David',
				text: 'Jest and Cypress probably',
				timestamp: new Date('2024-01-17T10:15:00'),
			},
			{
				id: 'c46',
				author: 'Lisa',
				text: 'Good choice for testing stack',
				timestamp: new Date('2024-01-17T10:30:00'),
			},
			{
				id: 'c47',
				author: 'Tom',
				text: 'Need help with mobile testing?',
				timestamp: new Date('2024-01-17T10:45:00'),
			},
			{
				id: 'c48',
				author: 'Mike',
				text: 'Yes, Tom, that would be great',
				timestamp: new Date('2024-01-17T11:00:00'),
			},
			{
				id: 'c49',
				author: 'Sarah',
				text: 'Team collaboration is excellent',
				timestamp: new Date('2024-01-17T11:15:00'),
			},
			{
				id: 'c50',
				author: 'Alex',
				text: "Let's crush this sprint!",
				timestamp: new Date('2024-01-17T11:30:00'),
			},
		],
	},
	{
		id: '7',
		type: 'voice',
		x: 600,
		y: 200,
		content: 'voice-note-3.mp3',
		caption: 'Daily standup - progress updates',
		duration: 25,
		keywords: ['standup', 'progress', 'blockers', 'goals'],
		timestamp: new Date('2024-01-17T15:00:00'),
		author: 'David',
		comments: [
			{
				id: 'c51',
				author: 'Julian',
				text: 'Good progress across the board',
				timestamp: new Date('2024-01-17T15:15:00'),
			},
			{
				id: 'c52',
				author: 'Mike',
				text: 'Any blockers we should address?',
				timestamp: new Date('2024-01-17T15:30:00'),
			},
			{
				id: 'c53',
				author: 'Alex',
				text: 'API integration is on track',
				timestamp: new Date('2024-01-17T15:45:00'),
			},
			{
				id: 'c54',
				author: 'Emma',
				text: 'UI components are ready',
				timestamp: new Date('2024-01-17T16:00:00'),
			},
			{
				id: 'c55',
				author: 'David',
				text: 'Database optimization complete',
				timestamp: new Date('2024-01-17T16:15:00'),
			},
			{
				id: 'c56',
				author: 'Lisa',
				text: 'Design system is finalized',
				timestamp: new Date('2024-01-17T16:30:00'),
			},
			{
				id: 'c57',
				author: 'Tom',
				text: 'Testing environment is ready',
				timestamp: new Date('2024-01-17T16:45:00'),
			},
			{
				id: 'c58',
				author: 'Sarah',
				text: 'Great team coordination',
				timestamp: new Date('2024-01-17T17:00:00'),
			},
		],
	},

	// Continue with more days and items...
	// Day 4 - January 18
	{
		id: '8',
		type: 'image',
		x: 450,
		y: 350,
		content: '/new-uploaded-image.jpg',
		caption: 'Final design mockups for review',
		timestamp: new Date('2024-01-18T10:00:00'),
		author: 'Emma',
		comments: [
			{
				id: 'c59',
				author: 'Julian',
				text: 'These look production-ready',
				timestamp: new Date('2024-01-18T10:15:00'),
			},
			{
				id: 'c60',
				author: 'Mike',
				text: 'Client will love these designs',
				timestamp: new Date('2024-01-18T10:30:00'),
			},
			{
				id: 'c61',
				author: 'Alex',
				text: 'Implementation will be smooth',
				timestamp: new Date('2024-01-18T10:45:00'),
			},
			{
				id: 'c62',
				author: 'David',
				text: 'Performance considerations?',
				timestamp: new Date('2024-01-18T11:00:00'),
			},
			{
				id: 'c63',
				author: 'Lisa',
				text: 'Optimized for fast loading',
				timestamp: new Date('2024-01-18T11:15:00'),
			},
			{
				id: 'c64',
				author: 'Tom',
				text: 'Accessibility checks passed',
				timestamp: new Date('2024-01-18T11:30:00'),
			},
			{
				id: 'c65',
				author: 'Sarah',
				text: 'Ready for client presentation',
				timestamp: new Date('2024-01-18T11:45:00'),
			},
			{
				id: 'c66',
				author: 'Emma',
				text: 'Thanks for all the feedback!',
				timestamp: new Date('2024-01-18T12:00:00'),
			},
		],
	},

	// Add more items for remaining days...
	// Days 5-15 with varying amounts of content
	...Array.from({ length: 10 }, (_, dayIndex) => {
		const dayOffset = dayIndex + 5
		const date = new Date(`2024-01-${15 + dayOffset}T09:00:00`)
		const itemsPerDay = Math.floor(Math.random() * 20) + 10 // 10-30 items per day

		return Array.from({ length: itemsPerDay }, (_, itemIndex) => {
			const itemId = `day${dayOffset}_item${itemIndex}`
			const hour = 9 + Math.floor(itemIndex * 0.5)
			const minute = (itemIndex % 2) * 30
			const timestamp = new Date(
				`2024-01-${15 + dayOffset}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
			)

			// 80% comments, 20% main content
			if (itemIndex === 0) {
				// First item is always a main content item
				const types = ['voice', 'image', 'text']
				const type = types[Math.floor(Math.random() * types.length)] as
					| 'voice'
					| 'image'
					| 'text'
				const authors = [
					'Julian',
					'Sarah',
					'Mike',
					'Alex',
					'Emma',
					'David',
					'Lisa',
					'Tom',
				]
				const author = authors[Math.floor(Math.random() * authors.length)]

				return {
					id: itemId,
					type,
					x: 200 + Math.random() * 400,
					y: 150 + Math.random() * 300,
					content:
						type === 'voice'
							? `voice-${itemId}.mp3`
							: type === 'image'
								? '/design-mockup.jpg'
								: `Day ${dayOffset} content: ${['Meeting notes', 'Project update', 'Research findings', 'Design feedback'][Math.floor(Math.random() * 4)]}`,
					caption: `${['Important', 'Urgent', 'Review', 'Update'][Math.floor(Math.random() * 4)]} item for day ${dayOffset}`,
					timestamp,
					author,
					duration:
						type === 'voice'
							? Math.floor(Math.random() * 120) + 30
							: undefined,
					keywords:
						type === 'voice'
							? ['meeting', 'update', 'progress']
							: undefined,
					comments: Array.from(
						{ length: Math.floor(Math.random() * 8) + 3 },
						(_, commentIndex) => ({
							id: `${itemId}_comment${commentIndex}`,
							author:
								authors[Math.floor(Math.random() * authors.length)],
							text: [
								'Great point!',
								'I agree with this approach',
								'Can we discuss this further?',
								'Looks good to me',
								'What about the timeline?',
								'This needs more work',
								'Excellent progress',
								"Let's schedule a follow-up",
								'Good catch!',
								'I have some concerns',
								'This is exactly what we need',
								'Well done!',
							][Math.floor(Math.random() * 12)],
							timestamp: new Date(
								timestamp.getTime() + (commentIndex + 1) * 15 * 60000,
							), // 15 min intervals
						}),
					),
				}
			} else {
				// Return null for non-main items since we're generating comments within main items
				return null
			}
		}).filter(Boolean)
	}).flat(),
].filter(Boolean) as CanvasItemData[]

export default function InfiniteCanvas() {
	const [layoutMode, setLayoutMode] = useState<'chronological' | 'tasks'>(
		'chronological',
	)
	const [zoom, setZoom] = useState(1)
	const [showFilters, setShowFilters] = useState(false)
	const [showPlusMenu, setShowPlusMenu] = useState(false)
	const [typeFilter, setTypeFilter] = useState('all')
	const [userFilter, setUserFilter] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [taskDialogOpen, setTaskDialogOpen] = useState(false)
	const [noteDialogOpen, setNoteDialogOpen] = useState(false)
	const [privateNoteDialogOpen, setPrivateNoteDialogOpen] = useState(false)
	const [editingTask, setEditingTask] = useState<any>(null)
	const [editingNote, setEditingNote] = useState<any>(null)
	const [newPrivateNote, setNewPrivateNote] = useState({
		content: '',
		keywords: '',
		date: new Date(),
	})
	const [items, setItems] = useState<CanvasItemData[]>(mockItems)
	const [selectedItem, setSelectedItem] = useState<string | null>(null)
	const [commentDialogOpen, setCommentDialogOpen] = useState(false)
	const [pan, setPan] = useState({ x: 0, y: 0 })
	const [isPanning, setIsPanning] = useState(false)
	const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
	const [authorFilter, setAuthorFilter] = useState<string>('')
	const [taskStatusFilter, setTaskStatusFilter] = useState<
		'all' | 'To do' | 'Doing' | 'Reviewing' | 'Done'
	>('all')
	const [showTimeline, setShowTimeline] = useState(false)
	const [showJulianNotes, setShowJulianNotes] = useState(true)
	const [commentEditDialogOpen, setCommentEditDialogOpen] = useState(false)
	const [editingComment, setEditingComment] = useState<any>(null)

	const [isDraggingDateBar, setIsDraggingDateBar] = useState(false)
	const [dragStartX, setDragStartX] = useState(0)
	const [scrollStartX, setScrollStartX] = useState(0)

	const [showTaskList, setShowTaskList] = useState(false)
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: '1',
			text: 'Follow up on budget approval process',
			completed: false,
			createdAt: new Date('2024-01-15T10:00:00'),
			priority: 'high',
		},
		{
			id: '2',
			text: 'Review mobile-first approach for wireframe',
			completed: false,
			createdAt: new Date('2024-01-15T14:00:00'),
			priority: 'medium',
		},
		{
			id: '3',
			text: 'Consider dark mode for mobile app',
			completed: true,
			createdAt: new Date('2024-01-15T17:30:00'),
			priority: 'low',
		},
	])
	const [newTaskText, setNewTaskText] = useState('')
	const [newTaskPriority, setNewTaskPriority] = useState<
		'low' | 'medium' | 'high'
	>('medium')
	const canvasRef = useRef<HTMLDivElement>(null)

	const [isAddingNote, setIsAddingNote] = useState(false)
	const [noteType, setNoteType] = useState<
		'voice' | 'image' | 'text' | 'comment' | 'task' | 'private'
	>('text')
	const [editingItem, setEditingItem] = useState<any>(null)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element
			if (
				!target.closest('.filter-panel') &&
				!target.closest('[data-filter-button]')
			) {
				setShowFilters(false)
			}
			if (
				!target.closest('.plus-menu') &&
				!target.closest('[data-plus-button]')
			) {
				setShowPlusMenu(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const filteredItems = useMemo(() => {
		if (!items || !Array.isArray(items)) return []

		return items.filter((item) => {
			if (typeFilter !== 'all' && item.type !== typeFilter) return false

			if (searchQuery) {
				const query = searchQuery.toLowerCase()
				const captionMatch = item.caption?.toLowerCase().includes(query)
				const commentMatch = item.comments?.some(
					(comment) =>
						comment.text.toLowerCase().includes(query) ||
						comment.author.toLowerCase().includes(query),
				)
				const keywordMatch = item.keywords?.some((keyword) =>
					keyword.toLowerCase().includes(query),
				)
				const contentMatch = item.content?.toLowerCase().includes(query)
				if (
					!captionMatch &&
					!commentMatch &&
					!keywordMatch &&
					!contentMatch
				)
					return false
			}

			if (authorFilter) {
				const hasAuthor =
					item.author
						?.toLowerCase()
						.includes(authorFilter.toLowerCase()) ||
					item.comments?.some((comment) =>
						comment.author
							?.toLowerCase()
							.includes(authorFilter.toLowerCase()),
					)
				if (!hasAuthor) return false
			}

			if (taskStatusFilter !== 'all') {
				const hasTaskWithStatus = item.taskItems?.some(
					(task) => task.status === taskStatusFilter,
				)
				if (!hasTaskWithStatus) return false
			}

			return true
		})
	}, [items, searchQuery, typeFilter, authorFilter, taskStatusFilter])

	const chronologicalItems = useMemo(() => {
		if (!filteredItems || !Array.isArray(filteredItems)) return []
		return [...filteredItems].sort(
			(a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
		)
	}, [filteredItems])

	const itemsByDay = useMemo(() => {
		if (!chronologicalItems || !Array.isArray(chronologicalItems)) return []

		const groups: { [key: string]: CanvasItemData[] } = {}
		chronologicalItems.forEach((item) => {
			const dateKey = item.timestamp.toDateString()
			if (!groups[dateKey]) {
				groups[dateKey] = []
			}
			groups[dateKey].push(item)
		})
		return Object.entries(groups).sort(
			([a], [b]) => new Date(a).getTime() - new Date(b).getTime(),
		)
	}, [chronologicalItems])

	const uniqueAuthors = useMemo(() => {
		if (!items || !Array.isArray(items)) return []

		const authors = new Set<string>()
		items.forEach((item) => {
			if (item.author) authors.add(item.author)
			if (item.comments && Array.isArray(item.comments)) {
				item.comments.forEach((comment) => {
					if (comment.author) authors.add(comment.author)
				})
			}
		})
		return Array.from(authors)
	}, [items])

	const clearFilters = () => {
		setSearchQuery('')
		setTypeFilter('all')
		setAuthorFilter('')
		setTaskStatusFilter('all')
	}

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		if (e.target === canvasRef.current) {
			setIsPanning(true)
			setLastPanPoint({ x: e.clientX, y: e.clientY })
			e.preventDefault()
		}
	}, [])

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (isPanning) {
				const deltaX = e.clientX - lastPanPoint.x
				const deltaY = e.clientY - lastPanPoint.y
				setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
				setLastPanPoint({ x: e.clientX, y: e.clientY })
			}
		},
		[isPanning, lastPanPoint],
	)

	const handleMouseUp = useCallback(() => {
		setIsPanning(false)
	}, [])

	const handleCanvasClick = useCallback(
		(e: React.MouseEvent) => {
			if (!isPanning && e.target === canvasRef.current) {
				const rect = canvasRef.current.getBoundingClientRect()
				const clickX = e.clientX - rect.left
				const clickY = e.clientY - rect.top

				// Calculate the center of the viewport
				const centerX = rect.width / 2
				const centerY = rect.height / 2

				// Calculate how much to pan to center the clicked point
				const deltaX = centerX - clickX
				const deltaY = centerY - clickY

				// Smooth pan to the clicked location
				setPan((prev) => ({
					x: prev.x + deltaX,
					y: prev.y + deltaY,
				}))
			}
		},
		[isPanning],
	)

	const handleWheel = useCallback((e: React.WheelEvent) => {
		e.preventDefault()
		const delta = e.deltaY > 0 ? 0.9 : 1.1
		setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)))
	}, [])

	const addVoiceNote = () => {
		setEditingNote({
			type: 'voice',
			content: '',
			keywords: [],
			duration: '0:30',
		})
		setNoteDialogOpen(true)
		setShowPlusMenu(false)
	}

	const addImageNote = () => {
		setEditingNote({
			type: 'image',
			content: '',
			keywords: [],
			imageFile: null,
		})
		setNoteDialogOpen(true)
		setShowPlusMenu(false)
	}

	const addTextNote = () => {
		setEditingNote({
			type: 'text',
			content: '',
			keywords: [],
		})
		setNoteDialogOpen(true)
		setShowPlusMenu(false)
	}

	const addLinkNote = () => {
		setEditingNote({
			type: 'link',
			content: '',
			keywords: [],
			url: '',
		})
		setNoteDialogOpen(true)
		setShowPlusMenu(false)
	}

	const addPrivateNoteDialog = () => {
		setNewPrivateNote({
			content: '',
			keywords: '',
			date: new Date(),
		})
		setPrivateNoteDialogOpen(true)
		setShowPlusMenu(false)
	}

	const addTask = () => {
		setEditingTask({
			text: '',
			status: 'To do',
			keywords: [],
			assignee: 'Julian',
			priority: 'Medium',
		})
		setTaskDialogOpen(true)
		setShowPlusMenu(false)
	}

	const editNote = (item: any) => {
		setEditingNote(item)
		setNoteDialogOpen(true)
	}

	const editComment = (comment: any, itemId: string) => {
		setEditingComment({ ...comment, itemId })
		setCommentEditDialogOpen(true)
	}

	const saveNote = (noteData: any) => {
		if (editingNote) {
			// Update existing note
			setItems(
				items.map((item) =>
					item.id === editingNote.id ? { ...item, ...noteData } : item,
				),
			)
		}
		setNoteDialogOpen(false)
		setEditingNote(null)
	}

	const saveComment = (commentData: any) => {
		if (editingComment) {
			// Update existing comment
			setItems(
				items.map((item) =>
					item.id === editingComment.itemId
						? {
								...item,
								comments: item.comments?.map((c: any) =>
									c.id === editingComment.id
										? { ...c, text: commentData.text }
										: c,
								),
							}
						: item,
				),
			)
		}
		setCommentEditDialogOpen(false)
		setEditingComment(null)
	}

	const saveTask = (taskData: Partial<TaskItem>) => {
		if (editingTask) {
			// Update existing task
			if (editingTask.parentItemId) {
				// Task belongs to an item
				setItems(
					items.map((item) =>
						item.id === editingTask.parentItemId
							? {
									...item,
									taskItems:
										item.taskItems?.map((task) =>
											task.id === editingTask.id
												? { ...task, ...taskData }
												: task,
										) || [],
								}
							: item,
					),
				)
			} else {
				// Standalone task
				setTasks(
					tasks.map((task) =>
						task.id === editingTask.id ? { ...task, ...taskData } : task,
					),
				)
			}
		} else {
			// Create new task (existing logic)
			const newTask: TaskItem = {
				id: Date.now().toString(),
				text: taskData.text || '',
				status: taskData.status || 'To do',
				createdAt: new Date(),
				...taskData,
			}
			setTasks([...tasks, newTask])
		}
		setTaskDialogOpen(false)
		setEditingTask(null)
	}

	const handleDateBarMouseDown = (e: React.MouseEvent) => {
		setIsDraggingDateBar(true)
		setDragStartX(e.clientX)
		const scrollContainer = document.querySelector(
			'.chronological-scroll-container',
		)
		if (scrollContainer) {
			setScrollStartX(scrollContainer.scrollLeft)
		}
	}

	const handleDateBarMouseMove = (e: React.MouseEvent) => {
		if (!isDraggingDateBar) return

		const deltaX = e.clientX - dragStartX
		const scrollContainer = document.querySelector(
			'.chronological-scroll-container',
		)
		if (scrollContainer) {
			scrollContainer.scrollLeft = scrollStartX - deltaX
		}
	}

	const handleDateBarMouseUp = () => {
		setIsDraggingDateBar(false)
	}

	const addTaskToItem = (itemId: string, taskText: string) => {
		const newTask: TaskItem = {
			id: Date.now().toString(),
			text: taskText,
			status: 'To do',
			createdAt: new Date(),
		}
		setItems((prev) =>
			prev.map((item) =>
				item.id === itemId
					? { ...item, taskItems: [...item.taskItems, newTask] }
					: item,
			),
		)
	}

	const updateTaskStatus = (
		itemId: string,
		taskId: string,
		status: TaskItem['status'],
	) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === itemId
					? {
							...item,
							taskItems: item.taskItems.map((task) =>
								task.id === taskId ? { ...task, status } : task,
							),
						}
					: item,
			),
		)
	}

	const deleteTaskFromItem = (itemId: string, taskId: string) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === itemId
					? {
							...item,
							taskItems: item.taskItems.filter(
								(task) => task.id !== taskId,
							),
						}
					: item,
			),
		)
	}

	const handleItemClick = (itemId: string) => {
		setSelectedItem(itemId)
	}

	const handleCommentClick = (itemId: string) => {
		setSelectedItem(itemId)
		setCommentDialogOpen(true)
	}

	const addCommentToItem = (itemId: string, text: string) => {
		const newComment: Comment = {
			id: Date.now().toString(),
			author: 'You',
			text,
			timestamp: new Date(),
		}

		setItems((prev) =>
			prev.map((item) =>
				item.id === itemId
					? { ...item, comments: [...item.comments, newComment] }
					: item,
			),
		)
	}

	const updateCaption = (itemId: string, caption: string) => {
		setItems((prev) =>
			prev.map((item) => (item.id === itemId ? { ...item, caption } : item)),
		)
	}

	const updateJulianNote = (itemId: string, note: string) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === itemId ? { ...item, julianNotes: note } : item,
			),
		)
		setEditingNote(null)
	}

	const toggleTask = (taskId: string) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId ? { ...task, completed: !task.completed } : task,
			),
		)
	}

	const deleteTask = (taskId: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== taskId))
	}

	const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
		switch (priority) {
			case 'high':
				return 'text-red-600 border-red-200'
			case 'medium':
				return 'text-yellow-600 border-yellow-200'
			case 'low':
				return 'text-green-600 border-green-200'
		}
	}

	const completedTasks = tasks.filter((task) => task.completed).length
	const totalTasks = tasks.length

	const formatTimestamp = (date: Date) => {
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const formatDate = (date: Date | string) => {
		const dateObj = date instanceof Date ? date : new Date(date)

		// Check if the date is valid
		if (isNaN(dateObj.getTime())) {
			return 'Invalid Date'
		}

		return dateObj.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	const getStatusColor = (status: TaskItem['status']) => {
		switch (status) {
			case 'To do':
				return 'bg-gray-100 text-gray-800 border-gray-200'
			case 'Doing':
				return 'bg-blue-100 text-blue-800 border-blue-200'
			case 'Reviewing':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200'
			case 'Done':
				return 'bg-green-100 text-green-800 border-green-200'
		}
	}

	const zoomIn = () => {
		setZoom((prev) => Math.min(prev * 1.2, 3))
	}

	const zoomOut = () => {
		setZoom((prev) => Math.max(prev / 1.2, 0.1))
	}

	const resetZoom = () => {
		setZoom(1)
	}

	const fitToScreen = () => {
		// Calculate zoom to fit all content
		if (filteredItems.length === 0) return

		const bounds = filteredItems.reduce(
			(acc, item) => {
				return {
					minX: Math.min(acc.minX, item.x),
					maxX: Math.max(acc.maxX, item.x + 300),
					minY: Math.min(acc.minY, item.y),
					maxY: Math.max(acc.maxY, item.y + 200),
				}
			},
			{
				minX: Number.POSITIVE_INFINITY,
				maxX: Number.NEGATIVE_INFINITY,
				minY: Number.POSITIVE_INFINITY,
				maxY: Number.NEGATIVE_INFINITY,
			},
		)

		const contentWidth = bounds.maxX - bounds.minX
		const contentHeight = bounds.maxY - bounds.minY
		const containerWidth = canvasRef.current?.clientWidth || 1000
		const containerHeight = canvasRef.current?.clientHeight || 600

		const scaleX = containerWidth / contentWidth
		const scaleY = containerHeight / contentHeight
		const newZoom = Math.min(scaleX, scaleY) * 0.8 // 80% to add some padding

		setZoom(Math.max(0.1, Math.min(3, newZoom)))

		// Center the content
		const centerX = (bounds.minX + bounds.maxX) / 2
		const centerY = (bounds.minY + bounds.maxY) / 2
		setPan({
			x: containerWidth / 2 - centerX * newZoom,
			y: containerHeight / 2 - centerY * newZoom,
		})
	}

	const toggleView = () => {
		setLayoutMode(layoutMode === 'chronological' ? 'tasks' : 'chronological')
	}

	const allTasks = useMemo(() => {
		if (!items || !Array.isArray(items) || !tasks || !Array.isArray(tasks))
			return []

		const itemTasks: Task[] = items.flatMap((item) =>
			(item.taskItems || []).map((taskItem) => ({
				id: taskItem.id,
				text: taskItem.text,
				completed: taskItem.status === 'Done',
				createdAt: taskItem.createdAt,
				priority: 'medium' as const, // Default priority
				status: taskItem.status,
				parentItem: item,
			})),
		)

		return [...tasks, ...itemTasks]
	}, [tasks, items])

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const getLeftColumnItems = (dayItems: any[]) => {
		return dayItems.filter((item) => {
			// Include all items except private text notes
			if (item.type === 'text' && item.isPrivate) return false
			return true // Include voice, image, tasks, comments, and public text notes
		})
	}

	const getRightColumnItems = (dayItems: any[]) => {
		return dayItems.filter((item) => {
			// Only include private text notes
			return item.type === 'text' && item.isPrivate
		})
	}

	const groupedByDate = useMemo(() => {
		const groups: { [key: string]: CanvasItemData[] } = {}

		filteredItems.forEach((item) => {
			// Ensure we have a valid date string in YYYY-MM-DD format
			const dateKey =
				item.timestamp instanceof Date
					? item.timestamp.toISOString().split('T')[0]
					: new Date(item.timestamp).toISOString().split('T')[0]

			if (!groups[dateKey]) {
				groups[dateKey] = []
			}
			groups[dateKey].push(item)
		})

		return groups
	}, [filteredItems])

	const leftColumnItems =
		groupedByDate[Object.keys(groupedByDate)[0]]?.filter((item) => {
			if (item.type === 'text' && item.isPrivate) return false // Exclude private notes from left
			return true // Include all other items (voice, image, text, tasks, comments)
		}) || []

	const rightColumnItems =
		groupedByDate[Object.keys(groupedByDate)[0]]?.filter((item) => {
			return item.type === 'text' && item.isPrivate // Only private notes in right column
		}) || []

	const addPrivateNote = () => {
		setEditingNote({
			id: '',
			type: 'text',
			content: '',
			author: 'Julian',
			timestamp: new Date(),
			keywords: [],
			isPrivate: true,
		})
		setIsNoteDialogOpen(true)
	}

	const addCommentNote = () => {
		setEditingNote({
			id: '',
			type: 'comment',
			content: '',
			author: 'Julian',
			timestamp: new Date(),
			keywords: [],
			isPrivate: false,
		})
		setIsNoteDialogOpen(true)
	}

	const editTaskItem = (task: any, itemId: string) => {
		setEditingTask({ ...task, parentItemId: itemId })
		setTaskDialogOpen(true)
	}

	return (
		<div className="h-screen w-screen bg-background overflow-hidden relative">
			{/* Top-right controls */}
			<div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
				<Button
					onClick={toggleView}
					variant="outline"
					className="bg-background/80 backdrop-blur-sm min-w-[120px]"
				>
					{layoutMode === 'chronological' ? (
						<>
							<CheckSquare className="w-4 h-4 mr-2" />
							All Tasks
						</>
					) : (
						<>
							<Calendar className="w-4 h-4 mr-2" />
							Timeline View
						</>
					)}
				</Button>

				{/* Zoom Controls */}
				<div className="flex gap-2">
					<Button
						onClick={zoomOut}
						variant="outline"
						size="sm"
						className="bg-background/80 backdrop-blur-sm"
					>
						<ZoomOut className="w-4 h-4" />
					</Button>
					<Button
						onClick={resetZoom}
						variant="outline"
						size="sm"
						className="bg-background/80 backdrop-blur-sm"
					>
						{Math.round(zoom * 100)}%
					</Button>
					<Button
						onClick={zoomIn}
						variant="outline"
						size="sm"
						className="bg-background/80 backdrop-blur-sm"
					>
						<ZoomIn className="w-4 h-4" />
					</Button>
					<Button
						onClick={fitToScreen}
						variant="outline"
						size="sm"
						className="bg-background/80 backdrop-blur-sm"
					>
						<Maximize2 className="w-4 h-4" />
					</Button>
				</div>

				{/* Filters Button */}
				<Button
					onClick={() => setShowFilters(!showFilters)}
					variant="outline"
					className="bg-background/80 backdrop-blur-sm min-w-[120px]"
				>
					<Filter className="w-4 h-4 mr-2" />
					Filters
				</Button>
			</div>

			{/* Expandable Plus Button */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
				<div className="relative group">
					<Button
						className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
						onClick={() => setShowPlusMenu(!showPlusMenu)}
					>
						<Plus className="w-6 h-6" />
					</Button>

					{/* Plus Button Menu */}
					{showPlusMenu && (
						<div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-2 space-y-2 z-50">
							<Button
								onClick={addVoiceNote}
								variant="ghost"
								size="sm"
								className="w-full justify-start text-blue-600 hover:bg-blue-50"
							>
								<Mic className="w-4 h-4 mr-2" />
								Voice Note
							</Button>
							<Button
								onClick={addImageNote}
								variant="ghost"
								size="sm"
								className="w-full justify-start text-pink-600 hover:bg-pink-50"
							>
								<Camera className="w-4 h-4 mr-2" />
								Image
							</Button>
							<Button
								onClick={addCommentNote}
								variant="ghost"
								size="sm"
								className="w-full justify-start text-gray-600 hover:bg-gray-50"
							>
								<MessageCircle className="w-4 h-4 mr-2" />
								Comment
							</Button>
							<Button
								onClick={addTask}
								variant="ghost"
								size="sm"
								className="w-full justify-start text-purple-600 hover:bg-purple-50"
							>
								<CheckSquare className="w-4 h-4 mr-2" />
								Task
							</Button>
							<Button
								onClick={addPrivateNoteDialog}
								variant="ghost"
								size="sm"
								className="w-full justify-start text-yellow-600 hover:bg-yellow-50"
							>
								<Lock className="w-4 h-4 mr-2" />
								Private Note
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Filter Panel */}
			{showFilters && (
				<div className="absolute top-20 right-4 z-20 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg min-w-80">
					<div className="flex items-center justify-between mb-3">
						<h3 className="font-medium text-sm">Filter Content</h3>
						<Button
							onClick={clearFilters}
							variant="ghost"
							size="sm"
							className="h-6 px-2 text-xs"
						>
							<X className="w-3 h-3 mr-1" />
							Clear
						</Button>
					</div>

					<div className="space-y-3">
						{/* Search */}
						<div>
							<label className="text-xs font-medium text-muted-foreground mb-1 block">
								Search content
							</label>
							<div className="relative">
								<Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-7 h-8 text-sm"
								/>
							</div>
						</div>

						{/* Type Filter */}
						<div>
							<label className="text-xs font-medium text-muted-foreground mb-1 block">
								Content type
							</label>
							<div className="flex gap-1 flex-wrap">
								<Badge
									variant={
										typeFilter === 'all' ? 'default' : 'secondary'
									}
									className="cursor-pointer text-xs px-2 py-1"
									onClick={() => setTypeFilter('all')}
								>
									All ({items?.length || 0})
								</Badge>
								<Badge
									variant={
										typeFilter === 'voice' ? 'default' : 'secondary'
									}
									className="cursor-pointer text-xs px-2 py-1"
									onClick={() => setTypeFilter('voice')}
								>
									Voice (
									{items?.filter((i) => i.type === 'voice').length ||
										0}
									)
								</Badge>
								<Badge
									variant={
										typeFilter === 'image' ? 'default' : 'secondary'
									}
									className="cursor-pointer text-xs px-2 py-1"
									onClick={() => setTypeFilter('image')}
								>
									Images (
									{items?.filter((i) => i.type === 'image').length ||
										0}
									)
								</Badge>
								<Badge
									variant={
										typeFilter === 'text' ? 'default' : 'secondary'
									}
									className="cursor-pointer text-xs px-2 py-1"
									onClick={() => setTypeFilter('text')}
								>
									Text (
									{items?.filter((i) => i.type === 'text').length || 0}
									)
								</Badge>
							</div>
						</div>

						{/* Task Status Filter */}
						<div>
							<label className="text-xs font-medium text-muted-foreground mb-1 block">
								Task status
							</label>
							<div className="flex gap-1 flex-wrap">
								{(
									[
										'all',
										'To do',
										'Doing',
										'Reviewing',
										'Done',
									] as const
								).map((status) => (
									<Badge
										key={status}
										variant={
											taskStatusFilter === status
												? 'default'
												: 'secondary'
										}
										className="cursor-pointer text-xs px-2 py-1"
										onClick={() => setTaskStatusFilter(status)}
									>
										{status === 'all' ? 'All Tasks' : status}
									</Badge>
								))}
							</div>
						</div>

						{/* Author Filter */}
						{uniqueAuthors.length > 0 && (
							<div>
								<label className="text-xs font-medium text-muted-foreground mb-1 block">
									Filter by author
								</label>
								<div className="flex flex-wrap gap-1">
									{uniqueAuthors.map((author) => (
										<Badge
											key={author}
											variant={
												authorFilter === author
													? 'default'
													: 'secondary'
											}
											className="cursor-pointer text-xs px-2 py-1"
											onClick={() =>
												setAuthorFilter(
													authorFilter === author ? '' : author,
												)
											}
										>
											{author}
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Chronological View */}
			{layoutMode === 'chronological' && (
				<div className="h-screen w-screen bg-background overflow-hidden relative">
					<div
						className="chronological-scroll-container h-full overflow-x-auto overflow-y-hidden pt-0"
						style={{
							transform: `scale(${zoom})`,
							transformOrigin: 'top left',
						}}
					>
						<div className="flex gap-16 p-8 min-h-full">
							{groupedByDate && Object.keys(groupedByDate).length > 0 ? (
								// Updated chronological view to use proper filtering functions
								Object.entries(groupedByDate).map(
									([dateKey, dayItems]) => {
										const leftItems = getLeftColumnItems(dayItems)
										const rightItems = getRightColumnItems(dayItems)

										return (
											<div
												key={dateKey}
												className="flex-shrink-0 w-[700px] mr-8"
											>
												{/* Date Header */}
												<div className="mb-6 text-center">
													<h2 className="text-lg font-semibold text-foreground">
														{formatDate(new Date(dateKey))}
													</h2>
													<p className="text-sm text-muted-foreground">
														{new Date(dateKey).toLocaleDateString(
															'en-US',
															{ weekday: 'long' },
														)}
													</p>
												</div>

												<div className="flex gap-6">
													{/* Left Column - General Items including public text notes */}
													<div className="w-80">
														<div className="mb-4">
															<h3 className="text-sm font-medium text-muted-foreground mb-3">
																Voice, Images, Tasks, Comments &
																Public Notes
															</h3>
														</div>
														<div className="space-y-3">
															{leftItems.map((item) => (
																<div
																	key={item.id}
																	className="space-y-2"
																>
																	{item.type === 'text' &&
																		!item.isPrivate && (
																			<div className="bg-green-200 rounded-xl p-3 text-green-900 shadow-md relative group">
																				<Button
																					onClick={() =>
																						editNote(item)
																					}
																					variant="ghost"
																					size="sm"
																					className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-green-300 hover:bg-green-400 text-green-900 h-6 w-6 p-0"
																				>
																					<Edit2 className="w-3 h-3" />
																				</Button>
																				<div className="flex items-center gap-2 mb-2">
																					<FileText className="w-4 h-4" />
																					<span className="text-xs font-medium">
																						{item.author}
																					</span>
																					<span className="text-xs opacity-70">
																						{formatTime(
																							item.timestamp,
																						)}
																					</span>
																				</div>
																				<p className="text-sm font-medium mb-1">
																					{item.content}
																				</p>
																				{item.keywords &&
																					item.keywords
																						.length >
																						0 && (
																						<div className="flex flex-wrap gap-1 mb-2">
																							{item.keywords.map(
																								(
																									keyword,
																									i,
																								) => (
																									<span
																										key={
																											i
																										}
																										className="text-xs bg-green-300 px-2 py-0.5 rounded-full"
																									>
																										{
																											keyword
																										}
																									</span>
																								),
																							)}
																						</div>
																					)}
																			</div>
																		)}

																	{/* Voice Note Card */}
																	{item.type === 'voice' && (
																		<div className="bg-blue-200 rounded-xl p-3 text-blue-900 shadow-md relative group">
																			<Button
																				onClick={() =>
																					editNote(item)
																				}
																				variant="ghost"
																				size="sm"
																				className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-300 hover:bg-blue-400 text-blue-900 h-6 w-6 p-0"
																			>
																				<Edit2 className="w-3 h-3" />
																			</Button>
																			<div className="flex items-center gap-2 mb-2">
																				<Mic className="w-4 h-4" />
																				<span className="text-xs font-medium">
																					{item.author}
																				</span>
																				<span className="text-xs opacity-70">
																					{formatTime(
																						item.timestamp,
																					)}
																				</span>
																			</div>
																			<p className="text-sm font-medium mb-1">
																				{item.caption}
																			</p>
																			{item.keywords &&
																				item.keywords
																					.length > 0 && (
																					<div className="flex flex-wrap gap-1 mb-2">
																						{item.keywords.map(
																							(
																								keyword,
																								i,
																							) => (
																								<span
																									key={
																										i
																									}
																									className="text-xs bg-blue-300 px-2 py-0.5 rounded-full"
																								>
																									{
																										keyword
																									}
																								</span>
																							),
																						)}
																					</div>
																				)}
																		</div>
																	)}

																	{/* Image Card */}
																	{item.type === 'image' && (
																		<div className="bg-pink-200 rounded-xl p-3 text-pink-900 shadow-md relative group">
																			<Button
																				onClick={() =>
																					editNote(item)
																				}
																				variant="ghost"
																				size="sm"
																				className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-300 hover:bg-pink-400 text-pink-900 h-6 w-6 p-0"
																			>
																				<Edit2 className="w-3 h-3" />
																			</Button>
																			<div className="flex items-center gap-2 mb-2">
																				<Camera className="w-4 h-4" />
																				<span className="text-xs font-medium">
																					{item.author}
																				</span>
																				<span className="text-xs opacity-70">
																					{formatTime(
																						item.timestamp,
																					)}
																				</span>
																			</div>
																			<div className="w-full h-24 bg-pink-300 rounded-lg mb-2 flex items-center justify-center">
																				<Camera className="w-6 h-6 opacity-50" />
																			</div>
																			<p className="text-sm font-medium">
																				{item.caption}
																			</p>
																			{item.keywords &&
																				item.keywords
																					.length > 0 && (
																					<div className="flex flex-wrap gap-1 mt-2">
																						{item.keywords.map(
																							(
																								keyword,
																								i,
																							) => (
																								<span
																									key={
																										i
																									}
																									className="text-xs bg-pink-300 px-2 py-0.5 rounded-full"
																								>
																									{
																										keyword
																									}
																								</span>
																							),
																						)}
																					</div>
																				)}
																		</div>
																	)}

																	{/* Task Items */}
																	{item.taskItems &&
																		item.taskItems.length >
																			0 && (
																			<div className="space-y-2">
																				{item.taskItems.map(
																					(
																						task,
																						taskIndex,
																					) => (
																						<div
																							key={
																								taskIndex
																							}
																							className="bg-purple-200 rounded-lg p-2 text-purple-900 shadow-sm relative group"
																						>
																							<Button
																								onClick={() =>
																									editTaskItem(
																										task,
																										item.id,
																									)
																								}
																								variant="ghost"
																								size="sm"
																								className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-300 hover:bg-purple-400 text-purple-900 h-5 w-5 p-0"
																							>
																								<Edit2 className="w-2.5 h-2.5" />
																							</Button>
																							<div className="flex items-center gap-2 mb-1">
																								<CheckSquare className="w-3 h-3" />
																								<span className="text-xs font-medium">
																									Task
																								</span>
																								<Badge
																									variant="outline"
																									className="text-xs px-1 py-0"
																								>
																									{
																										task.status
																									}
																								</Badge>
																							</div>
																							<p className="text-xs">
																								{
																									task.description
																								}
																							</p>
																							{task.keywords &&
																								task
																									.keywords
																									.length >
																									0 && (
																									<div className="flex flex-wrap gap-1 mt-1">
																										{task.keywords.map(
																											(
																												keyword,
																												i,
																											) => (
																												<span
																													key={
																														i
																													}
																													className="text-xs bg-purple-300 px-1 py-0.5 rounded-full"
																												>
																													{
																														keyword
																													}
																												</span>
																											),
																										)}
																									</div>
																								)}
																						</div>
																					),
																				)}
																			</div>
																		)}

																	{/* Comments */}
																	{item.comments &&
																		item.comments.length >
																			0 && (
																			<div className="space-y-1">
																				{item.comments.map(
																					(
																						comment,
																						commentIndex,
																					) => (
																						<div
																							key={
																								commentIndex
																							}
																							className="bg-gray-200 rounded-lg p-2 text-gray-900 shadow-sm relative group"
																						>
																							<Button
																								onClick={() =>
																									editComment(
																										comment,
																										item.id,
																									)
																								}
																								variant="ghost"
																								size="sm"
																								className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-300 hover:bg-gray-400 text-gray-900 h-5 w-5 p-0"
																							>
																								<Edit2 className="w-2.5 h-2.5" />
																							</Button>
																							<div className="flex items-center gap-2 mb-1">
																								<MessageCircle className="w-3 h-3" />
																								<span className="text-xs font-medium">
																									{
																										comment.author
																									}
																								</span>
																								<span className="text-xs opacity-70">
																									{formatTime(
																										comment.timestamp,
																									)}
																								</span>
																							</div>
																							<p className="text-xs">
																								{
																									comment.text
																								}
																							</p>
																							{comment.keywords &&
																								comment
																									.keywords
																									.length >
																									0 && (
																									<div className="flex flex-wrap gap-1 mt-1">
																										{comment.keywords.map(
																											(
																												keyword,
																												i,
																											) => (
																												<span
																													key={
																														i
																													}
																													className="text-xs bg-gray-300 px-1 py-0.5 rounded-full"
																												>
																													{
																														keyword
																													}
																												</span>
																											),
																										)}
																									</div>
																								)}
																						</div>
																					),
																				)}
																			</div>
																		)}
																</div>
															))}
														</div>
													</div>

													{/* Right Column - My Private Notes */}
													<div className="w-80">
														<div className="mb-4">
															<h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
																<Lock className="w-4 h-4" />
																My Private Notes
															</h3>
														</div>
														<div className="space-y-3">
															{rightItems.map((item) => (
																<div
																	key={item.id}
																	className="bg-yellow-200 rounded-xl p-3 text-yellow-900 shadow-md relative group"
																>
																	<Button
																		onClick={() =>
																			editNote(item)
																		}
																		variant="ghost"
																		size="sm"
																		className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-300 hover:bg-yellow-400 text-yellow-900 h-6 w-6 p-0"
																	>
																		<Edit2 className="w-3 h-3" />
																	</Button>
																	<div className="flex items-center gap-2 mb-2">
																		<Lock className="w-4 h-4" />
																		<span className="text-xs font-medium">
																			{item.author}
																		</span>
																		<span className="text-xs opacity-70">
																			{formatTime(
																				item.timestamp,
																			)}
																		</span>
																	</div>
																	<p className="text-sm font-medium mb-1">
																		{item.content}
																	</p>
																	{item.keywords &&
																		item.keywords.length >
																			0 && (
																			<div className="flex flex-wrap gap-1 mb-2">
																				{item.keywords.map(
																					(keyword, i) => (
																						<span
																							key={i}
																							className="text-xs bg-yellow-300 px-2 py-0.5 rounded-full"
																						>
																							{keyword}
																						</span>
																					),
																				)}
																			</div>
																		)}
																</div>
															))}
														</div>
													</div>
												</div>
											</div>
										)
									},
								)
							) : (
								<div className="flex items-center justify-center h-full w-full">
									<p className="text-muted-foreground">
										No items to display
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* All Tasks View */}
			{layoutMode === 'tasks' && (
				<div className="h-screen w-screen bg-background overflow-hidden relative">
					<div className="pt-4 px-8 h-full overflow-y-auto">
						<div className="max-w-6xl mx-auto">
							<h1 className="text-2xl font-bold mb-6">All Tasks</h1>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{allTasks && Array.isArray(allTasks) ? (
									allTasks.map((task) => (
										<div
											key={task.id}
											className="bg-card border rounded-lg p-4 shadow-sm relative group"
										>
											<Button
												onClick={() => editTaskItem(task)}
												variant="ghost"
												size="sm"
												className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-200 hover:bg-purple-300 text-purple-700"
											>
												<Edit2 className="w-4 h-4" />
											</Button>

											<div className="flex items-center justify-between mb-2">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														task.status === 'Done'
															? 'bg-green-100 text-green-800'
															: task.status === 'Doing'
																? 'bg-blue-100 text-blue-800'
																: task.status === 'Reviewing'
																	? 'bg-yellow-100 text-yellow-800'
																	: 'bg-gray-100 text-gray-800'
													}`}
												>
													{task.status ||
														(task.completed ? 'Done' : 'To do')}
												</span>
												<span className="text-xs text-muted-foreground">
													{formatTimestamp(task.createdAt)}
												</span>
											</div>
											<div className="text-sm font-medium mb-2">
												{task.text}
											</div>
											{task.parentItem && (
												<div className="text-xs text-muted-foreground">
													From: {task.parentItem.caption}
												</div>
											)}
										</div>
									))
								) : (
									<div className="col-span-full text-center text-muted-foreground">
										No tasks to display
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			<Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{editingTask ? 'Edit Task' : 'New Task'}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium">
								Task Description
							</label>
							<Textarea
								placeholder="Enter task description..."
								defaultValue={editingTask?.text || ''}
								onChange={(e) =>
									setEditingTask((prev) =>
										prev ? { ...prev, text: e.target.value } : null,
									)
								}
							/>
						</div>
						<div>
							<label className="text-sm font-medium">Status</label>
							<select
								className="w-full p-2 border rounded-md"
								defaultValue={editingTask?.status || 'To do'}
								onChange={(e) =>
									setEditingTask((prev) =>
										prev ? { ...prev, status: e.target.value } : null,
									)
								}
							>
								<option value="To do">To do</option>
								<option value="Doing">Doing</option>
								<option value="Reviewing">Reviewing</option>
								<option value="Done">Done</option>
							</select>
						</div>
						<div>
							<label className="text-sm font-medium">
								Keywords (comma-separated)
							</label>
							<input
								type="text"
								className="w-full p-2 border rounded-md"
								placeholder="keyword1, keyword2, keyword3"
								defaultValue={editingTask?.keywords?.join(', ') || ''}
								onChange={(e) =>
									setEditingTask((prev) =>
										prev
											? {
													...prev,
													keywords: e.target.value
														.split(',')
														.map((k) => k.trim())
														.filter((k) => k),
												}
											: null,
									)
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setTaskDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={() => saveTask(editingTask || {})}>
							{editingTask ? 'Update Task' : 'Create Task'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							Edit{' '}
							{editingNote?.type === 'voice'
								? 'Voice Note'
								: editingNote?.type === 'image'
									? 'Image Post'
									: 'Text Note'}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						{editingNote?.type === 'voice' && (
							<>
								<div>
									<label className="text-sm font-medium">
										Caption
									</label>
									<Textarea
										placeholder="Enter voice note caption..."
										defaultValue={editingNote?.caption || ''}
										onChange={(e) =>
											setEditingNote((prev: any) =>
												prev
													? { ...prev, caption: e.target.value }
													: null,
											)
										}
									/>
								</div>
								<div>
									<label className="text-sm font-medium">
										Keywords (comma-separated)
									</label>
									<input
										type="text"
										className="w-full p-2 border rounded-md"
										placeholder="keyword1, keyword2, keyword3"
										defaultValue={
											editingNote?.keywords?.join(', ') || ''
										}
										onChange={(e) =>
											setEditingNote((prev: any) =>
												prev
													? {
															...prev,
															keywords: e.target.value
																.split(',')
																.map((k: string) => k.trim()),
														}
													: null,
											)
										}
									/>
								</div>
							</>
						)}
						{editingNote?.type === 'image' && (
							<div>
								<label className="text-sm font-medium">Caption</label>
								<Textarea
									placeholder="Enter image caption..."
									defaultValue={editingNote?.caption || ''}
									onChange={(e) =>
										setEditingNote((prev: any) =>
											prev
												? { ...prev, caption: e.target.value }
												: null,
										)
									}
								/>
							</div>
						)}
						{editingNote?.type === 'text' && (
							<div>
								<label className="text-sm font-medium">Content</label>
								<Textarea
									placeholder="Enter text content..."
									defaultValue={editingNote?.content || ''}
									rows={6}
									onChange={(e) =>
										setEditingNote((prev: any) =>
											prev
												? { ...prev, content: e.target.value }
												: null,
										)
									}
								/>
							</div>
						)}
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setNoteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={() => saveNote(editingNote)}>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={commentEditDialogOpen}
				onOpenChange={setCommentEditDialogOpen}
			>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Edit Comment</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium">Comment Text</label>
							<Textarea
								placeholder="Enter comment text..."
								defaultValue={editingComment?.text || ''}
								onChange={(e) =>
									setEditingComment((prev: any) =>
										prev ? { ...prev, text: e.target.value } : null,
									)
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setCommentEditDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={() => saveComment(editingComment)}>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Comment Dialog */}
			<CommentDialog
				open={commentDialogOpen}
				onOpenChange={setCommentDialogOpen}
				item={
					selectedItem ? items.find((i) => i.id === selectedItem) : null
				}
				onAddComment={(text) =>
					selectedItem && addCommentToItem(selectedItem, text)
				}
			/>

			{isNoteDialogOpen && (
				<Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>
								{editingNote?.id ? 'Edit' : 'Add'}{' '}
								{editingNote?.type === 'text' && editingNote?.isPrivate
									? 'Private Note'
									: editingNote?.type === 'voice'
										? 'Voice Note'
										: editingNote?.type === 'image'
											? 'Image'
											: 'Note'}
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							{editingNote?.type === 'voice' && (
								<div>
									<Label htmlFor="caption">Caption</Label>
									<Input
										id="caption"
										value={editingNote.caption || ''}
										onChange={(e) =>
											setEditingNote({
												...editingNote,
												caption: e.target.value,
											})
										}
										placeholder="Enter voice note caption..."
									/>
								</div>
							)}

							{editingNote?.type === 'image' && (
								<div>
									<Label htmlFor="caption">Caption</Label>
									<Input
										id="caption"
										value={editingNote.caption || ''}
										onChange={(e) =>
											setEditingNote({
												...editingNote,
												caption: e.target.value,
											})
										}
										placeholder="Enter image caption..."
									/>
								</div>
							)}

							{editingNote?.type === 'text' && (
								<div>
									<Label htmlFor="content">Content</Label>
									<Textarea
										id="content"
										value={editingNote.content || ''}
										onChange={(e) =>
											setEditingNote({
												...editingNote,
												content: e.target.value,
											})
										}
										placeholder="Enter note content..."
										rows={4}
									/>
								</div>
							)}

							{editingNote?.type === 'text' &&
								editingNote?.isPrivate && (
									<div>
										<Label htmlFor="date">Date</Label>
										<Select
											value={
												editingNote.timestamp
													? editingNote.timestamp.toDateString()
													: new Date().toDateString()
											}
											onValueChange={(value) => {
												let selectedDate = new Date()
												if (value === 'today')
													selectedDate = new Date()
												else if (value === 'tomorrow') {
													selectedDate = new Date()
													selectedDate.setDate(
														selectedDate.getDate() + 1,
													)
												} else if (value === 'yesterday') {
													selectedDate = new Date()
													selectedDate.setDate(
														selectedDate.getDate() - 1,
													)
												} else {
													selectedDate = new Date(value)
												}
												setEditingNote({
													...editingNote,
													timestamp: selectedDate,
												})
											}}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="yesterday">
													Yesterday
												</SelectItem>
												<SelectItem value="today">Today</SelectItem>
												<SelectItem value="tomorrow">
													Tomorrow
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}

							<div>
								<Label htmlFor="keywords">
									Keywords (comma-separated)
								</Label>
								<Input
									id="keywords"
									value={editingNote?.keywords?.join(', ') || ''}
									onChange={(e) =>
										setEditingNote({
											...editingNote,
											keywords: e.target.value
												.split(',')
												.map((k) => k.trim())
												.filter((k) => k),
										})
									}
									placeholder="Enter keywords..."
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsNoteDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button onClick={saveNote}>Save</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	)
}
