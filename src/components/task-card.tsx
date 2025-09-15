'use client'

import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { CheckSquare, Edit2 } from 'lucide-react'
import type { TaskItem } from '~/lib/types'

interface TaskCardProps {
	task: TaskItem
	itemId: string
	onEdit: (task: TaskItem, itemId: string) => void
}

export default function TaskCard({ task, itemId, onEdit }: TaskCardProps) {
	return (
		<div className="bg-purple-200 rounded-lg p-2 text-purple-900 shadow-sm relative group">
			<Button
				onClick={() => onEdit(task, itemId)}
				variant="ghost"
				size="sm"
				className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-300 hover:bg-purple-400 text-purple-900 h-5 w-5 p-0"
			>
				<Edit2 className="w-2.5 h-2.5" />
			</Button>
			<div className="flex items-center gap-2 mb-1">
				<CheckSquare className="w-3 h-3" />
				<span className="text-xs font-medium">Task</span>
				<Badge variant="outline" className="text-xs px-1 py-0">
					{task.status}
				</Badge>
			</div>
			<p className="text-xs">{task.text}</p>
			{task.keywords && task.keywords.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-1">
					{task.keywords.map((keyword, i) => (
						<span
							key={i}
							className="text-xs bg-purple-300 px-1 py-0.5 rounded-full"
						>
							{keyword}
						</span>
					))}
				</div>
			)}
		</div>
	)
}
