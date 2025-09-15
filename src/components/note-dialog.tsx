'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import type { CanvasItemData } from '~/lib/types'

interface NoteDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	note: Partial<CanvasItemData> | null
	onNoteChange: (note: Partial<CanvasItemData> | null) => void
	onSave: (noteData: Partial<CanvasItemData>) => void
}

export default function NoteDialog({
	open,
	onOpenChange,
	note,
	onNoteChange,
	onSave,
}: NoteDialogProps) {
	if (!note) return null

	const isEditing = !!note.id

	const title = isEditing ? 'Edit' : 'Add'
	const noteType =
		note.type === 'text' && note.isPrivate
			? 'Private Note'
			: note.type === 'voice'
				? 'Voice Note'
				: note.type === 'image'
					? 'Image'
					: 'Note'

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{title} {noteType}
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					{note.type === 'voice' && (
						<div>
							<Label htmlFor="caption">Caption</Label>
							<Input
								id="caption"
								value={note.caption || ''}
								onChange={(e) =>
									onNoteChange({ ...note, caption: e.target.value })
								}
								placeholder="Enter voice note caption..."
							/>
						</div>
					)}

					{note.type === 'image' && (
						<div>
							<Label htmlFor="caption">Caption</Label>
							<Input
								id="caption"
								value={note.caption || ''}
								onChange={(e) =>
									onNoteChange({ ...note, caption: e.target.value })
								}
								placeholder="Enter image caption..."
							/>
						</div>
					)}

					{note.type === 'text' && (
						<div>
							<Label htmlFor="content">Content</Label>
							<Textarea
								id="content"
								value={note.content || ''}
								onChange={(e) =>
									onNoteChange({ ...note, content: e.target.value })
								}
								placeholder="Enter note content..."
								rows={4}
							/>
						</div>
					)}

					{note.type === 'text' && note.isPrivate && (
						<div>
							<Label htmlFor="date">Date</Label>
							<Select
								value={
									note.timestamp
										? note.timestamp.toDateString()
										: new Date().toDateString()
								}
								onValueChange={(value) => {
									let selectedDate = new Date()
									if (value === 'today') selectedDate = new Date()
									else if (value === 'tomorrow') {
										selectedDate = new Date()
										selectedDate.setDate(selectedDate.getDate() + 1)
									} else if (value === 'yesterday') {
										selectedDate = new Date()
										selectedDate.setDate(selectedDate.getDate() - 1)
									} else {
										selectedDate = new Date(value)
									}
									onNoteChange({ ...note, timestamp: selectedDate })
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="yesterday">Yesterday</SelectItem>
									<SelectItem value="today">Today</SelectItem>
									<SelectItem value="tomorrow">Tomorrow</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}

					<div>
						<Label htmlFor="keywords">Keywords (comma-separated)</Label>
						<Input
							id="keywords"
							value={note.keywords?.join(', ') || ''}
							onChange={(e) =>
								onNoteChange({
									...note,
									keywords: e.target.value
										.split(',')
										.map((k) => k.trim())
										.filter((k) => k),
								})
							}
							placeholder="Enter keywords..."
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={() => onSave(note)}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
