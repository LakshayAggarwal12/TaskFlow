import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useDraftTask, useSuggestLabel } from "./hooks/useAI";
import AISuggestionCard from "./AISuggestionCard";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../context/ToastContext";

function getAiErrorMessage(err, fallbackMessage) {
  const apiMessage = err.response?.data?.message;
  const apiDetail = err.response?.data?.detail;

  if (apiMessage && apiDetail) {
    return `${apiMessage} ${apiDetail}`;
  }

  return apiMessage || apiDetail || fallbackMessage;
}

export default function AIAssistPanel({ task, projectId, onApplyDescription, onApplyLabel }) {
  const draftTask = useDraftTask(projectId);
  const suggestLabel = useSuggestLabel(projectId);
  const toast = useToast();
  const [activeAction, setActiveAction] = useState(null); // "draft" | "label" | null

  const handleDraft = async () => {
    setActiveAction("draft");
    try {
      await draftTask.mutateAsync({ title: task.title });
    } catch (err) {
      toast.error(getAiErrorMessage(err, "AI drafting failed — try again."));
      setActiveAction(null);
    }
  };

  const handleSuggestLabel = async () => {
    setActiveAction("label");
    try {
      await suggestLabel.mutateAsync({ title: task.title, description: task.description || "" });
    } catch (err) {
      toast.error(getAiErrorMessage(err, "AI suggestion failed — try again."));
      setActiveAction(null);
    }
  };

  const discard = () => {
    draftTask.reset();
    suggestLabel.reset();
    setActiveAction(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleDraft}
          className="flex items-center gap-1.5 px-2.5 h-7 rounded-sm bg-surface3 text-body-sm text-secondary hover:text-accent transition-colors duration-fast"
        >
          <Sparkles size={12} /> Draft description
        </button>
        <button
          onClick={handleSuggestLabel}
          className="flex items-center gap-1.5 px-2.5 h-7 rounded-sm bg-surface3 text-body-sm text-secondary hover:text-accent transition-colors duration-fast"
        >
          <Sparkles size={12} /> Suggest label
        </button>
      </div>

      {activeAction === "draft" && (
        <AISuggestionCard
          isLoading={draftTask.isPending}
          onDiscard={discard}
          onAccept={() => {
            onApplyDescription(draftTask.data.suggestion.description);
            discard();
          }}
        >
          {draftTask.data && (
            <div className="flex flex-col gap-2">
              <p className="text-body-sm text-primary">{draftTask.data.suggestion.description}</p>
              {draftTask.data.suggestion.acceptanceCriteria?.length > 0 && (
                <ul className="list-disc list-inside text-body-sm text-secondary space-y-0.5">
                  {draftTask.data.suggestion.acceptanceCriteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </AISuggestionCard>
      )}

      {activeAction === "label" && (
        <AISuggestionCard
          isLoading={suggestLabel.isPending}
          onDiscard={discard}
          onAccept={() => {
            onApplyLabel(suggestLabel.data.suggestion);
            discard();
          }}
        >
          {suggestLabel.data && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Badge tone="accent">{suggestLabel.data.suggestion.label}</Badge>
                <Badge tone={suggestLabel.data.suggestion.priority}>{suggestLabel.data.suggestion.priority}</Badge>
              </div>
              <p className="text-body-sm text-tertiary">{suggestLabel.data.suggestion.reasoning}</p>
            </div>
          )}
        </AISuggestionCard>
      )}
    </div>
  );
}
