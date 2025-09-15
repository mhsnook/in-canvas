'use client'

import { Button } from '~/components/ui/button'
import { Edit2, MessageCircle } from 'lucide-react'
import type { Comment } from '~/lib/types'

interface CommentCardProps {
	comment: Comment
	itemId: string
	formatTime: (date: Date) => string
	onEdit: (comment: Comment, itemId: string) => void
}

export default function CommentCard({
	comment,
	itemId,
	formatTime,
	onEdit,
}: CommentCardProps) {
	return (
		<div className="bg-gray-200 rounded-lg p-2 text-gray-900 shadow-sm relative group">
			<Button
				onClick={() => onEdit(comment, itemId)}
				variant="ghost"
				size="sm"
				className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-300 hover:bg-gray-400 text-gray-900 h-5 w-5 p-0"
			>
				<Edit2 className="w-2.5 h-2.5" />
			</Button>
			<div className="flex items-center gap-2 mb-1">
				<MessageCircle className="w-3 h-3" />
				<span className="text-xs font-medium">{comment.author}</span>
				<span className="text-xs opacity-70">
					{formatTime(comment.timestamp)}
				</span>
			</div>
			<p className="text-xs">{comment.text}</p>
			{comment.keywords && comment.keywords.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-1">
					{comment.keywords.map((keyword, i) => (
						<span
							key={i}
							className="text-xs bg-gray-300 px-1 py-0.5 rounded-full"
						>
							{keyword}
						</span>
					))}
				</div>
			)}
		</div>
	)
}
