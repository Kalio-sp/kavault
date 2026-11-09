import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import {
  ExternalLink,
  Plus,
  GitBranch,
  Search,
  FileText,
  Trash2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { confirmModal } from "../context/DialogContext";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  status: string;
  note?: string;
  createdAt: string;
}

export function GitHubCollection() {
  const { t } = useApp();
  const [repos, setRepos] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [noteText, setNoteText] = useState("");

  const fetchRepos = async () => {
    try {
      const response = await api.get("/resources");
      const filteredRepos = response.data.filter(
        (r: Resource) => r.type === "REPOSITORY",
      );
      setRepos(filteredRepos);
    } catch (error) {
      console.error("Ошибка загрузки репозиториев", error);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleAddRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    try {
      await api.post("/resources", {
        title,
        url,
        type: "REPOSITORY",
        status: "TO_LEARN",
      });
      setTitle("");
      setUrl("");
      fetchRepos();
    } catch (error) {
      console.error("Ошибка сохранения", error);
    }
  };

  const handleDelete = async (id: string) => {
    const repoToDelete = repos.find((r) => r.id === id);
    const nameLabel = repoToDelete ? ` «${repoToDelete.title}»` : "";
    const confirmed = await confirmModal({
      title: "Удалить репозиторий?",
      message: `Вы действительно хотите удалить репозиторий${nameLabel} из вашей коллекции?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/resources/${id}`);
      fetchRepos();
    } catch (error) {
      console.error("Ошибка удаления", error);
    }
  };

  const handleClearAll = async () => {
    if (repos.length === 0) return;
    const confirmed = await confirmModal({
      title: "Очистить все репозитории?",
      message: `Вы действительно хотите удалить все сохранённые репозитории (${repos.length} шт.) из вашей коллекции? Это действие нельзя отменить.`,
      confirmText: "Да, удалить всё",
      cancelText: "Отмена",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete("/resources/clear/all?type=REPOSITORY");
      fetchRepos();
    } catch (error) {
      console.error("Ошибка очистки репозиториев", error);
    }
  };

  const openNoteModal = (resource: Resource) => {
    setActiveResource(resource);
    setNoteText(resource.note || "");
    setIsNoteModalOpen(true);
  };

  const saveNote = async () => {
    if (!activeResource) return;
    try {
      await api.patch(`/resources/${activeResource.id}/note`, {
        note: noteText,
      });
      setIsNoteModalOpen(false);
      fetchRepos();
    } catch (error) {
      console.error("Ошибка сохранения заметки", error);
    }
  };

  const filteredRepos = repos.filter((repo) =>
    repo.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 600,
            margin: "0 0 var(--space-2) 0",
            color: "var(--text-primary)",
          }}
        >
          {t.git.title}
        </h2>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          {t.git.subtitle}
        </p>
      </div>

      <Card style={{ padding: "var(--space-5)" }}>
        <h3 style={{ fontSize: "16px", margin: "0 0 var(--space-4) 0" }}>
          {t.git.addRepo}
        </h3>
        <form
          onSubmit={handleAddRepo}
          style={{ display: "flex", gap: "var(--space-3)" }}
        >
          <div style={{ flex: 1 }}>
            <Input
              icon={<GitBranch size={16} />}
              placeholder={t.git.namePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              placeholder={t.git.urlPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <Button type="submit">
            <Plus size={18} /> {t.git.saveBtn}
          </Button>
        </form>
      </Card>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-4)",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h3
              style={{
                fontSize: "16px",
                margin: 0,
                color: "var(--text-secondary)",
              }}
            >
              {t.git.savedProjects} ({repos.length})
            </h3>
            {repos.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleClearAll}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  borderColor: "var(--border)",
                  gap: "6px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                title="Очистить все репозитории"
              >
                <Trash2 size={13} /> Очистить все репозитории
              </Button>
            )}
          </div>
          <div style={{ width: "250px" }}>
            <Input
              icon={<Search size={16} />}
              placeholder={t.git.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredRepos.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>{t.git.noRepos}</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {filteredRepos.map((item) => (
              <Card
                key={item.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "var(--space-5)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "var(--surface-raised)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GitBranch size={16} color="var(--text-secondary)" />
                  </div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      color: "var(--text-primary)",
                      wordBreak: "break-all",
                    }}
                  >
                    {item.title}
                  </h4>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginTop: "auto",
                    paddingTop: "var(--space-4)",
                  }}
                >
                  <Badge variant="default">
                    {item.status.replace("_", " ")}
                  </Badge>
                  <div
                    style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
                  >
                    <Button
                      variant="secondary"
                      onClick={() => openNoteModal(item)}
                      style={{
                        padding: "6px",
                        color: item.note ? "var(--accent)" : "inherit",
                      }}
                      title="Notes"
                    >
                      <FileText size={14} />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => window.open(item.url, "_blank")}
                      style={{ padding: "6px" }}
                      title="Open Repo"
                    >
                      <ExternalLink size={14} />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(item.id)}
                      style={{ padding: "6px", color: "#ef4444" }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title={`${t.git.notesTitle} ${activeResource?.title}`}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={t.git.notePlaceholder}
            style={{
              width: "100%",
              minHeight: "200px",
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-3)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              resize: "vertical",
              outline: "none",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-3)",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setIsNoteModalOpen(false)}
            >
              {t.git.cancel}
            </Button>
            <Button onClick={saveNote}>{t.git.saveNote}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
