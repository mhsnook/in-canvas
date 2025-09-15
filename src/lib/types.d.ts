export interface TaskItem {
	id: string
	text: string
	status: 'To do' | 'Doing' | 'Reviewing' | 'Done'
	createdAt: Date
	keywords?: string[]
}

export interface Task {
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

export interface CanvasItemData {
	id: string
	type: 'voice' | 'image' | 'text' | 'link'
	x: number
	y: number
	content: string
	caption?: string
	comments: Comment[]
	duration?: string
	isPlaying?: boolean
	keywords?: string[] | undefined
	timestamp: Date
	julianNotes?: string
	author: string
	taskItems: TaskItem[]
	isPrivate?: boolean
	imageFile?: File | null
	url?: string
}

export interface Comment {
	id: string
	author: string
	text: string
	timestamp: Date
	keywords?: string[] | undefined
}
