'use client'

import { Button } from '~/components/ui/button'
import { Edit2, FileText } from 'lucide-react'
import type { CanvasItemData } from '~/lib/types'

interface TextNoteCardProps {
	item: CanvasItemData
	formatTime: (date: Date) => string
	onEdit: (item: CanvasItemData) => void
}

export default function TextNoteCard({
	item,
	formatTime,
	onEdit,
}: TextNoteCardProps) {
	return (
		<div className="bg-green-200 rounded-xl p-3 text-green-900 shadow-md relative group">
			<Button
				onClick={() => onEdit(item)}
				variant="ghost"
				size="sm"
				className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-green-300 hover:bg-green-400 text-green-900 h-6 w-6 p-0"
			>
				<Edit2 className="w-3 h-3" />
			</Button>
			<div className="flex items-center gap-2 mb-2">
				<FileText className="w-4 h-4" />
				<span className="text-xs font-medium">{item.author}</span>
				<span className="text-xs opacity-70">
					{formatTime(item.timestamp)}
				</span>
			</div>
			<p className="text-sm font-medium mb-1">{item.content}</p>
			{item.keywords && item.keywords.length > 0 && (
				<div className="flex flex-wrap gap-1 mb-2">
					{item.keywords.map((keyword, i) => (
						<span
							key={i}
							className="text-xs bg-green-300 px-2 py-0.5 rounded-full"
						>
							{keyword}
						</span>
					))}
				</div>
			)}
		</div>
	)
}
