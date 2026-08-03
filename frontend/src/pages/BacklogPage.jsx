import { useState } from "react";
import { useParams } from "react-router-dom";
import { Search, Sparkles, ListChecks } from "lucide-react";
import { useProjectTasks } from "../features/tasks/hooks/useProjectTasks";
import { useAISearch } from "../features/ai/hooks/useAI";
import TaskDrawer from "../features/tasks/TaskDrawer";
import TaskListRow from "../features/tasks/TaskListRow";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Chip from "../components/ui/Chip";
import SignalDot from "../components/ui/SignalDot";
import { useToast } from "../context/ToastContext";

const FILTER_LABELS = {
  priority: (v) => `priority: ${v}`,
  isOverdue: () => "overdue",
  isDone: (v) => (v ? "done" : "not done"),
  assigneeNameContains: (v) => `assignee: ${v}`,
  labelContains: (v) => `label: ${v}`,
  keywordInTitle: (v) => `"${v}"`,
};

export default function BacklogPage() {
  const { projectId } = useParams();
  const { tasks: allTasks, isLoading } = useProjectTasks(projectId);
  const aiSearch = useAISearch(projectId);
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const runSearch = async () => {
    if (!query.trim()) return;
    try {
      const result = await aiSearch.mutateAsync({ query: query.trim() });
      setActiveFilters(result.interpretedFilters);
      setSearchResults(result.tasks);
    } catch (err) {
      toast.error(err.response?.data?.message || "AI search failed — try rephrasing.");
    }
  };

  const removeFilter = (key) => {
    // Removing a chip filters the ALREADY-returned results client-side —
    // it does not re-call the AI, per the planning doc's flow.
    const updated = { ...activeFilters, [key]: null };
    setActiveFilters(updated);
  };

  const clearSearch = () => {
    setQuery("");
    setActiveFilters(null);
    setSearchResults(null);
  };

  const displayedTasks = searchResults
    ? searchResults.filter((t) => {
        if (activeFilters?.priority && t.priority !== activeFilters.priority) return false;
        if (activeFilters?.labelContains && !t.labels?.some((l) => l.toLowerCase().includes(activeFilters.labelContains.toLowerCase()))) return false;
        if (activeFilters?.keywordInTitle && !t.title.toLowerCase().includes(activeFilters.keywordInTitle.toLowerCase())) return false;
        return true;
      })
    : allTasks;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-h1 font-display text-primary mb-5">Backlog</h1>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-md bg-surface2 border border-hairline focus-within:border-accent transition-colors duration-fast">
          <Sparkles size={14} className="text-tertiary shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder='Ask AI — "overdue high priority tasks assigned to Priya"'
            className="flex-1 bg-transparent text-body-sm text-primary placeholder:text-tertiary focus:outline-none"
          />
        </div>
        <button
          onClick={runSearch}
          disabled={aiSearch.isPending || !query.trim()}
          className="h-10 px-4 rounded-md bg-accent text-canvas text-body-sm font-medium hover:bg-accent-hover transition-colors duration-fast disabled:opacity-40"
        >
          {aiSearch.isPending ? <SignalDot variant="pulse" size={8} /> : "Search"}
        </button>
      </div>

      {activeFilters && (
        <div className="flex items-center gap-1.5 flex-wrap mb-5">
          {Object.entries(activeFilters)
            .filter(([, v]) => v !== null && v !== undefined && v !== false)
            .map(([key, value]) => (
              <Chip key={key} tone="accent" onRemove={() => removeFilter(key)}>
                {FILTER_LABELS[key] ? FILTER_LABELS[key](value) : `${key}: ${value}`}
              </Chip>
            ))}
          <button onClick={clearSearch} className="text-caption text-tertiary hover:text-primary transition-colors duration-fast ml-1">
            Clear search
          </button>
        </div>
      )}

      <div className="bg-surface1 border border-hairline rounded-lg overflow-hidden">
        {isLoading && (
          <div className="p-4 flex flex-col gap-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        )}

        {!isLoading && displayedTasks.length === 0 && (
          <EmptyState icon={ListChecks} title="No tasks found" description="Try a different search, or create tasks from a board." className="py-12" />
        )}

        {!isLoading && displayedTasks.length > 0 && (
          <div className="divide-y divide-hairline">
            {displayedTasks.map((task) => (
              <TaskListRow key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>

      <TaskDrawer />
    </div>
  );
}
