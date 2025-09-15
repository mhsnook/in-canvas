'use client'

import { Lock } from 'lucide-react'
import type { CanvasItemData, Comment, TaskItem } from '~/lib/types'
import TextNoteCard from './text-note-card'
import VoiceNoteCard from './voice-note-card'
import ImageCard from './image-card'
import TaskCard from './task-card'
import CommentCard from './comment-card'
import PrivateNoteCard from './private-note-card'

interface ChronologicalViewProps {
	groupedByDate: [string, CanvasItemData[]][]
	zoom: number
	formatDate: (date: Date | string) => string
	formatTime: (date: Date) => string
	getLeftColumnItems: (items: CanvasItemData[]) => CanvasItemData[]
	getRightColumnItems: (items: CanvasItemData[]) => CanvasItemData[]
	editNote: (item: CanvasItemData) => void
	editComment: (comment: Comment, itemId: string) => void
	editTaskItem: (task: TaskItem, itemId: string) => void
}

export default function ChronologicalView({
	groupedByDate,
	zoom,
	formatDate,
	formatTime,
	getLeftColumnItems,
	getRightColumnItems,
	editNote,
	editComment,
	editTaskItem,
}: ChronologicalViewProps) {
	return (
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
						groupedByDate.map(([dateKey, dayItems]) => {
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
												{
													weekday: 'long',
												},
											)}
										</p>
									</div>

									<div className="flex gap-6">
										{/* Left Column - General Items including public text notes */}
										<div className="w-80">
											<div className="mb-4">
												<h3 className="text-sm font-medium text-muted-foreground mb-3">
													Voice, Images, Tasks, Comments & Public
													Notes
												</h3>
											</div>
											<div className="space-y-3">
												{leftItems.map((item) => (
													<div key={item.id} className="space-y-2">
														{item.type === 'text' &&
															!item.isPrivate && (
																<TextNoteCard
																	item={item}
																	formatTime={formatTime}
																	onEdit={editNote}
																/>
															)}
														{item.type === 'voice' && (
															<VoiceNoteCard
																item={item}
																formatTime={formatTime}
																onEdit={editNote}
															/>
														)}
														{item.type === 'image' && (
															<ImageCard
																item={item}
																formatTime={formatTime}
																onEdit={editNote}
															/>
														)}
														{item.taskItems &&
															item.taskItems.length > 0 && (
																<div className="space-y-2">
																	{item.taskItems.map(
																		(task, taskIndex) => (
																			<TaskCard
																				key={taskIndex}
																				task={task}
																				itemId={item.id}
																				onEdit={
																					editTaskItem
																				}
																			/>
																		),
																	)}
																</div>
															)}
														{item.comments &&
															item.comments.length > 0 && (
																<div className="space-y-1">
																	{item.comments.map(
																		(
																			comment,
																			commentIndex,
																		) => (
																			<CommentCard
																				key={commentIndex}
																				comment={comment}
																				itemId={item.id}
																				formatTime={
																					formatTime
																				}
																				onEdit={editComment}
																			/>
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
													<PrivateNoteCard
														key={item.id}
														item={item}
														formatTime={formatTime}
														onEdit={editNote}
													/>
												))}
											</div>
										</div>
									</div>
								</div>
							)
						})
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
	)
}
