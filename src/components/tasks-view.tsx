'use client'

import { Button } from '~/components/ui/button'
import { Edit2 } from 'lucide-react'
import type { Task } from '~/lib/types'

interface TasksViewProps {
	tasks: (Task & { parentItem?: any })[]
	editTaskItem: (task: any, itemId?: string) => void
	formatTimestamp: (date: Date) => string
}

export default function TasksView({
	tasks,
	editTaskItem,
	formatTimestamp,
}: TasksViewProps) {
	return (
		<div className="h-screen w-screen bg-background overflow-hidden relative">
			<div className="pt-4 px-8 h-full overflow-y-auto">
				<div className="max-w-6xl mx-auto">
					<h1 className="text-2xl font-bold mb-6">All Tasks</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{tasks && Array.isArray(tasks) ? (
							tasks.map((task) => (
								<div
									key={task.id}
									className="bg-card border rounded-lg p-4 shadow-sm relative group"
								>
									<Button
										onClick={() =>
											editTaskItem(task, task.parentItem?.id)
										}
										variant="ghost"
										size="sm"
										className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-200 hover:bg-purple-300 text-purple-700"
									>
										<Edit2 className="w-4 h-4" />
									</Button>

									<div className="flex items-center justify-between mb-2">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === 'Done' ? 'bg-green-100 text-green-800' : task.status === 'Doing' ? 'bg-blue-100 text-blue-800' : task.status === 'Reviewing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
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
	)
}
