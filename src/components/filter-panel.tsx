'use client'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import type { CanvasItemData, TaskItem } from '~/lib/types'
import { Search, X } from 'lucide-react'

interface FilterPanelProps {
	showFilters: boolean
	searchQuery: string
	onSearchQueryChange: (query: string) => void
	typeFilter: string
	onTypeFilterChange: (type: string) => void
	taskStatusFilter: string
	onTaskStatusFilterChange: (
		status: 'all' | 'To do' | 'Doing' | 'Reviewing' | 'Done',
	) => void
	authorFilter: string
	onAuthorFilterChange: (author: string) => void
	items: CanvasItemData[]
	uniqueAuthors: string[]
	onClearFilters: () => void
}

export default function FilterPanel({
	showFilters,
	searchQuery,
	onSearchQueryChange,
	typeFilter,
	onTypeFilterChange,
	taskStatusFilter,
	onTaskStatusFilterChange,
	authorFilter,
	onAuthorFilterChange,
	items,
	uniqueAuthors,
	onClearFilters,
}: FilterPanelProps) {
	if (!showFilters) {
		return null
	}

	return (
		<div className="absolute top-20 right-4 z-20 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg min-w-80 filter-panel">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-medium text-sm">Filter Content</h3>
				<Button
					onClick={onClearFilters}
					variant="ghost"
					size="sm"
					className="h-6 px-2 text-xs"
				>
					<X className="w-3 h-3 mr-1" />
					Clear
				</Button>
			</div>

			<div className="space-y-3">
				{/* Search */}
				<div>
					<label
						htmlFor="search_filters_query"
						className="text-xs font-medium text-muted-foreground mb-1 block"
					>
						Search content
					</label>
					<div className="relative">
						<Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search..."
							id="search_filters_query"
							value={searchQuery}
							onChange={(e) => onSearchQueryChange(e.target.value)}
							className="pl-7 h-8 text-sm"
						/>
					</div>
				</div>

				{/* Type Filter */}
				<div>
					<label className="text-xs font-medium text-muted-foreground mb-1 block">
						Content type
					</label>
					<div className="flex gap-1 flex-wrap">
						<Badge
							variant={typeFilter === 'all' ? 'default' : 'secondary'}
							className="cursor-pointer text-xs px-2 py-1"
							onClick={() => onTypeFilterChange('all')}
						>
							All ({items?.length || 0})
						</Badge>
						<Badge
							variant={typeFilter === 'voice' ? 'default' : 'secondary'}
							className="cursor-pointer text-xs px-2 py-1"
							onClick={() => onTypeFilterChange('voice')}
						>
							Voice (
							{items?.filter((i) => i.type === 'voice').length || 0})
						</Badge>
						<Badge
							variant={typeFilter === 'image' ? 'default' : 'secondary'}
							className="cursor-pointer text-xs px-2 py-1"
							onClick={() => onTypeFilterChange('image')}
						>
							Images (
							{items?.filter((i) => i.type === 'image').length || 0})
						</Badge>
						<Badge
							variant={typeFilter === 'text' ? 'default' : 'secondary'}
							className="cursor-pointer text-xs px-2 py-1"
							onClick={() => onTypeFilterChange('text')}
						>
							Text ({items?.filter((i) => i.type === 'text').length || 0}
							)
						</Badge>
					</div>
				</div>

				{/* Task Status Filter */}
				<div>
					<label className="text-xs font-medium text-muted-foreground mb-1 block">
						Task status
					</label>
					<div className="flex gap-1 flex-wrap">
						{(
							['all', 'To do', 'Doing', 'Reviewing', 'Done'] as const
						).map((status) => (
							<Badge
								key={status}
								variant={
									taskStatusFilter === status ? 'default' : 'secondary'
								}
								className="cursor-pointer text-xs px-2 py-1"
								onClick={() => onTaskStatusFilterChange(status)}
							>
								{status === 'all' ? 'All Tasks' : status}
							</Badge>
						))}
					</div>
				</div>

				{/* Author Filter */}
				{uniqueAuthors.length > 0 && (
					<div>
						<label className="text-xs font-medium text-muted-foreground mb-1 block">
							Filter by author
						</label>
						<div className="flex flex-wrap gap-1">
							{uniqueAuthors.map((author) => (
								<Badge
									key={author}
									variant={
										authorFilter === author ? 'default' : 'secondary'
									}
									className="cursor-pointer text-xs px-2 py-1"
									onClick={() =>
										onAuthorFilterChange(
											authorFilter === author ? '' : author,
										)
									}
								>
									{author}
								</Badge>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
