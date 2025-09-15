'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Send } from 'lucide-react'

interface CommentDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	item: {
		id: string
		type: 'voice' | 'image'
		caption?: string
		comments: Array<{
			id: string
			author: string
			text: string
			timestamp: Date
		}>
	} | null
	onAddComment: (text: string) => void
}

export default function CommentDialog({
	open,
	onOpenChange,
	item,
	onAddComment,
}: CommentDialogProps) {
	const [newComment, setNewComment] = useState('')

	const handleSubmit = () => {
		if (newComment.trim()) {
			onAddComment(newComment.trim())
			setNewComment('')
		}
	}

	const formatTimestamp = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date)
	}

	if (!item) return null

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="text-balance">
						Comments on {item.type === 'voice' ? 'Voice Note' : 'Image'}
					</DialogTitle>
					{item.caption && (
						<p className="text-sm text-muted-foreground text-pretty">
							"{item.caption}"
						</p>
					)}
				</DialogHeader>

				<div className="space-y-4">
					<ScrollArea className="h-64 w-full">
						<div className="space-y-3 pr-4">
							{item.comments.length === 0 ? (
								<p className="text-sm text-muted-foreground text-center py-8">
									No comments yet. Be the first to comment!
								</p>
							) : (
								item.comments.map((comment) => (
									<div key={comment.id} className="flex gap-3">
										<Avatar className="w-8 h-8">
											<AvatarFallback className="text-xs bg-secondary">
												{comment.author.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 space-y-1">
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium">
													{comment.author}
												</span>
												<span className="text-xs text-muted-foreground">
													{formatTimestamp(comment.timestamp)}
												</span>
											</div>
											<p className="text-sm text-pretty">
												{comment.text}
											</p>
										</div>
									</div>
								))
							)}
						</div>
					</ScrollArea>

					<div className="flex gap-2">
						<Textarea
							placeholder="Add a comment..."
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							className="flex-1 min-h-[60px] resize-none"
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									handleSubmit()
								}
							}}
						/>
						<Button
							onClick={handleSubmit}
							disabled={!newComment.trim()}
							className="self-end"
						>
							<Send className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
