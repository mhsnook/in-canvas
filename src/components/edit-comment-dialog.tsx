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
import type { Comment } from '~/lib/types'

interface EditCommentDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	comment: (Comment & { itemId: string }) | null
	onCommentChange: (
		comment: (Comment & { itemId: string }) | null,
	) => void
	onSave: (commentData: Comment) => void
}

export default function EditCommentDialog({
	open,
	onOpenChange,
	comment,
	onCommentChange,
	onSave,
}: EditCommentDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit Comment</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<label className="text-sm font-medium">Comment Text</label>
						<Textarea
							placeholder="Enter comment text..."
							defaultValue={comment?.text || ''}
							onChange={(e) =>
								onCommentChange(
									comment ? { ...comment, text: e.target.value } : null,
								)
							}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={() => comment && onSave(comment)}>
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
