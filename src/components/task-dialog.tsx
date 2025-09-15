'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import type { Task, TaskItem } from '~/lib/types'

interface TaskDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	task: (Partial<Task> & Partial<TaskItem>) | null
	onTaskChange: (task: (Partial<Task> & Partial<TaskItem>) | null) => void
	onSave: (taskData: Partial<Task> & Partial<TaskItem>) => void
}

export default function TaskDialog({
	open,
	onOpenChange,
	task,
	onTaskChange,
	onSave,
}: TaskDialogProps) {
	if (!task) return null

	const isEditing = !!task.id

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{isEditing ? 'Edit Task' : 'New Task'}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="task_description"
							className="text-sm font-medium"
						>
							Task Description
						</label>
						<Textarea
							placeholder="Enter task description..."
							defaultValue={task?.text || ''}
							id="task_description"
							onChange={(e) =>
								onTaskChange(
									task ? { ...task, text: e.target.value } : null,
								)
							}
						/>
					</div>
					<div>
						<label
							htmlFor="status_select"
							className="text-sm font-medium"
						>
							Status
						</label>
						<select
							className="w-full p-2 border rounded-md"
							defaultValue={task?.status || 'To do'}
							id="status_select"
							onChange={(e) =>
								onTaskChange(
									task
										? {
												...task,
												status: e.target
													.value as TaskItem['status'],
											}
										: null,
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
						<label
							htmlFor="task_keywords"
							className="text-sm font-medium"
						>
							Keywords (comma-separated)
						</label>
						<input
							type="text"
							id="task_keywords"
							className="w-full p-2 border rounded-md"
							placeholder="keyword1, keyword2, keyword3"
							defaultValue={task?.keywords?.join(', ') || ''}
							onChange={(e) =>
								onTaskChange(
									task
										? {
												...task,
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
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={() => onSave(task)}>
						{isEditing ? 'Update Task' : 'Create Task'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
