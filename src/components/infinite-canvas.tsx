'use client'

import {
	Calendar,
	CheckSquare,
	Filter,
	Maximize2,
	ZoomIn,
	ZoomOut,
} from 'lucide-react'
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import CommentDialog from '~/components/comment-dialog'
import { Button } from '~/components/ui/button'
import { mockItems } from '~/lib/mock-data'
import type { CanvasItemData, Comment, Task, TaskItem } from '~/lib/types'
import ChronologicalView from './chronological-view'
import EditCommentDialog from './edit-comment-dialog'
import FilterPanel from './filter-panel'
import NoteDialog from './note-dialog'
import PlusMenu from './plus-menu'
import TaskDialog from './task-dialog'
import TasksView from './tasks-view'

export default function InfiniteCanvas() {
	const [layoutMode, setLayoutMode] = useState<'chronological' | 'tasks'>(
		'chronological',
	)
	const [zoom, setZoom] = useState(1)
	const [showFilters, setShowFilters] = useState(false)
	const [showPlusMenu, setShowPlusMenu] = useState(false)
	const [typeFilter, setTypeFilter] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [items, setItems] = useState<CanvasItemData[]>(mockItems)
	const [selectedItem, setSelectedItem] = useState<string | null>(null)
	const [commentDialogOpen, setCommentDialogOpen] = useState(false)
	const [authorFilter, setAuthorFilter] = useState<string>('')
	const [taskStatusFilter, setTaskStatusFilter] = useState<
		'all' | 'To do' | 'Doing' | 'Reviewing' | 'Done'
	>('all')

	// Dialog states
	const [taskDialogOpen, setTaskDialogOpen] = useState(false)
	const [noteDialogOpen, setNoteDialogOpen] = useState(false)
	const [commentEditDialogOpen, setCommentEditDialogOpen] = useState(false)
	const [editingTask, setEditingTask] = useState<
		(Partial<Task> & Partial<TaskItem>) | null
	>(null)
	const [editingNote, setEditingNote] =
		useState<Partial<CanvasItemData> | null>(null)
	const [editingComment, setEditingComment] = useState<
		(Comment & { itemId: string }) | null
	>(null)
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
	const canvasRef = useRef<HTMLDivElement>(null)

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

	const addPrivateNoteDialog = () => {
		setEditingNote({
			type: 'text',
			content: '',
			isPrivate: true,
		})
		setNoteDialogOpen(true)
		setShowPlusMenu(false)
	}

	const addTask = () => {
		setEditingTask({
			text: '',
			status: 'To do',
			assignee: 'Julian',
			priority: 'medium',
		})
		setTaskDialogOpen(true)
		setShowPlusMenu(false)
	}

	const editNote = (item: CanvasItemData) => {
		setEditingNote(item)
		setNoteDialogOpen(true)
	}

	const editComment = (comment: Comment, itemId: string) => {
		setEditingComment({ ...comment, itemId })
		setCommentEditDialogOpen(true)
	}

	const saveNote = (noteData: Partial<CanvasItemData>) => {
		if (editingNote) {
			if (noteData.id) {
				// Update existing note
				setItems(
					items.map((item) =>
						item.id === noteData.id ? { ...item, ...noteData } : item,
					),
				)
			} else {
				// Create new note
				const newNote: CanvasItemData = {
					id: Date.now().toString(),
					author: 'You',
					timestamp: new Date(),
					comments: [],
					taskItems: [],
					...noteData,
				} as CanvasItemData
				setItems([...items, newNote])
			}
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
						? ({
								...item,
								comments: item.comments?.map((c: any) =>
									c.id === editingComment.id
										? { ...c, text: commentData.text }
										: c,
								),
							} as CanvasItemData)
						: item,
				),
			)
		}
		setCommentEditDialogOpen(false)
		setEditingComment(null)
	}

	const saveTask = (taskData: Partial<Task> & Partial<TaskItem>) => {
		if (editingTask) {
			// Update existing task
			if (editingTask.parentItem?.id) {
				// Task belongs to an item
				setItems(
					items.map((item) =>
						item.id === editingTask.parentItem?.id
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
						task.id === editingTask.id
							? ({ ...task, ...taskData } as Task)
							: task,
					),
				)
			}
		} else {
			// Create new task (existing logic)
			const newTask: Task = {
				id: Date.now().toString(),
				text: taskData.text || '',
				status: taskData.status || 'To do',
				createdAt: new Date(),
				...taskData,
			} as Task
			setTasks([...tasks, newTask])
		}
		setTaskDialogOpen(false)
		setEditingTask(null)
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

	const formatTimestamp = (date: Date) => {
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const formatDateForChronologicalView = (date: Date | string) => {
		const dateObj = date instanceof Date ? date : new Date(date)

		// Check if the date is valid
		if (isNaN(dateObj.getTime())) {
			return 'Invalid Date'
		}

		return dateObj.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
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

	const addTextNote = () => {
		setEditingNote({
			type: 'text',
			content: '',
		})
		setNoteDialogOpen(true)
		setShowPlusMenu(false)
	}

	const editTaskItem = (task: Task | TaskItem, itemId?: string) => {
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
				<PlusMenu
					onAddVoiceNote={addVoiceNote}
					onAddImageNote={addImageNote}
					onAddTextNote={addTextNote}
					onAddTask={addTask}
					onAddPrivateNote={addPrivateNoteDialog}
				/>
			</div>

			{/* Filter Panel */}
			<FilterPanel
				showFilters={showFilters}
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
				typeFilter={typeFilter}
				onTypeFilterChange={setTypeFilter}
				taskStatusFilter={taskStatusFilter}
				onTaskStatusFilterChange={setTaskStatusFilter}
				authorFilter={authorFilter}
				onAuthorFilterChange={setAuthorFilter}
				items={items}
				uniqueAuthors={uniqueAuthors}
				onClearFilters={clearFilters}
			/>

			{/* Chronological View */}
			{layoutMode === 'chronological' && (
				<ChronologicalView
					groupedByDate={Object.entries(groupedByDate)}
					zoom={zoom}
					formatDate={formatDateForChronologicalView}
					formatTime={formatTime}
					getLeftColumnItems={getLeftColumnItems}
					getRightColumnItems={getRightColumnItems}
					editNote={editNote}
					editComment={editComment}
					editTaskItem={editTaskItem}
				/>
			)}

			{/* All Tasks View */}
			{layoutMode === 'tasks' && (
				<TasksView
					tasks={allTasks}
					editTaskItem={editTaskItem}
					formatTimestamp={formatTimestamp}
				/>
			)}

			<TaskDialog
				open={taskDialogOpen}
				onOpenChange={setTaskDialogOpen}
				task={editingTask}
				onTaskChange={setEditingTask}
				onSave={saveTask}
			/>

			<NoteDialog
				open={noteDialogOpen}
				onOpenChange={setNoteDialogOpen}
				note={editingNote}
				onNoteChange={setEditingNote}
				onSave={saveNote}
			/>

			<EditCommentDialog
				open={commentEditDialogOpen}
				onOpenChange={setCommentEditDialogOpen}
				comment={editingComment}
				onCommentChange={setEditingComment}
				onSave={saveComment}
			/>

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
		</div>
	)
}
