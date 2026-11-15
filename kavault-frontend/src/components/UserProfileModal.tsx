import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  UserPlus,
  UserCheck,
  Clock,
  Calendar,
  ShieldCheck,
  UserMinus,
  Edit3,
} from "lucide-react";
import { api } from "../api/axios";
import { BannerRenderer } from "./BannerRenderer";
import { UserAvatarBadge } from "./UserAvatarBadge";
import type { UserProfileCustomization } from "../utils/profileCosmetics";

interface UserProfileModalProps {
  userId: string | null;
  onClose: () => void;
  initialData?: {
    id: string;
    nickname: string;
    mmr: number;
    rankTier?: any;
    studyLanguage?: string;
    cardsCount?: number;
    resourcesCount?: number;
    profileCustomization?: Partial<UserProfileCustomization> | null;
  } | null;
  onFriendshipUpdated?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  onClose,
  initialData,
  onFriendshipUpdated,
}) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(initialData || null);
  const [_loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    const fetchFullProfile = async () => {
      setLoading(!initialData);
      try {
        const resp = await api.get(`/social/user-profile/${userId}`);
        if (isMounted) {
          setProfile(resp.data);
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFullProfile();

    return () => {
      isMounted = false;
    };
  }, [userId, initialData]);

  if (!userId) return null;

  const currentRankTier = profile?.rankTier || {
    key: "novice",
    title: "Novice",
    emoji: "🌱",
    color: "#94a3b8",
  };

  const customization: Partial<UserProfileCustomization> =
    profile?.profileCustomization || {};

  const handleSendRequest = async () => {
    if (!profile?.nickname) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      await api.post("/social/friends/request", { nickname: profile.nickname });
      setProfile((prev: any) => ({
        ...prev,
        relationStatus: "PENDING_SENT",
      }));
      setActionMsg("✅ Заявка в друзья отправлена!");
      if (onFriendshipUpdated) onFriendshipUpdated();
    } catch (e: any) {
      setActionMsg(e.response?.data?.message || "Не удалось отправить заявку");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRespondRequest = async (accept: boolean) => {
    if (!profile?.friendshipId) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      await api.post(`/social/friends/${profile.friendshipId}/respond`, {
        accept,
      });
      setProfile((prev: any) => ({
        ...prev,
        relationStatus: accept ? "FRIENDS" : "NONE",
      }));
      setActionMsg(accept ? "🎉 Теперь вы друзья!" : "Заявка отклонена");
      if (onFriendshipUpdated) onFriendshipUpdated();
    } catch (e: any) {
      setActionMsg(e.response?.data?.message || "Ошибка при ответе на заявку");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!profile?.friendshipId) return;
    if (!window.confirm(`Удалить @${profile.nickname} из друзей?`)) return;
    setActionLoading(true);
    try {
      await api.delete(`/social/friends/${profile.friendshipId}`);
      setProfile((prev: any) => ({
        ...prev,
        relationStatus: "NONE",
        friendshipId: null,
      }));
      setActionMsg("Удален из друзей");
      if (onFriendshipUpdated) onFriendshipUpdated();
    } catch (e: any) {
      setActionMsg(e.response?.data?.message || "Ошибка при удалении");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("ru-RU", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const joinedDate = formatDate(profile?.createdAt || profile?.joinedAt);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "16px",
        paddingTop: "max(24px, env(safe-area-inset-top, 24px))",
        paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "520px",
          marginTop: "0",
          marginBottom: "auto",
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "var(--surface, #121214)",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.12))",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255,255,255,0.2)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100dvh - 48px)",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          flexShrink: 0,
        }}
      >
        {/* ВЕРХНИЙ БАННЕР ПРОФИЛЯ */}
        <div style={{ position: "relative", height: "140px", width: "100%" }}>
          <BannerRenderer
            customization={customization}
            style={{ height: "140px", width: "100%" }}
          />

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 30,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            <X size={16} />
          </button>

          {/* Плашка лиги на баннере */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "14px",
              zIndex: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "999px",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: `1px solid ${currentRankTier.color}88`,
              fontSize: "12px",
              fontWeight: 700,
              color: currentRankTier.color,
            }}
          >
            <span>{currentRankTier.emoji}</span>
            <span>{currentRankTier.title}</span>
          </div>

          {/* Аватарка с рамкой, накладывающаяся на баннер */}
          <div
            style={{
              position: "absolute",
              bottom: "-36px",
              left: "20px",
              zIndex: 25,
            }}
          >
            <UserAvatarBadge
              customization={customization}
              size={76}
              username={profile?.nickname || "User"}
              showOnlineDot
            />
          </div>
        </div>

        {/* ОСНОВНОЕ ТЕЛО ПРОФИЛЯ */}
        <div
          style={{
            padding: "46px 20px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            overflowY: "auto",
          }}
        >
          {/* Никнейм, титул и статус */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  margin: 0,
                  color: "var(--text-primary, #ffffff)",
                  letterSpacing: "-0.01em",
                }}
              >
                @{profile?.nickname || "Пользователь"}
              </h2>

              {profile?.isCreator && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(245, 158, 11, 0.2)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    color: "#f59e0b",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  <ShieldCheck size={12} />
                  ROOT
                </span>
              )}

              {profile?.globalRank && (
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(59, 130, 246, 0.15)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    color: "#60a5fa",
                    fontSize: "11.5px",
                    fontWeight: 700,
                  }}
                >
                  #{profile.globalRank} в мире
                </span>
              )}
            </div>

            {/* Персональный титул */}
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-secondary, #a1a1aa)",
                marginTop: "3px",
              }}
            >
              {customization.title || "Архитектор знаний 🏛️"}
            </div>

            {/* Статус-плашка */}
            {customization.statusText && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "8px",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface-raised, rgba(255,255,255,0.05))",
                  border: "1px solid var(--border, rgba(255,255,255,0.08))",
                  fontSize: "12px",
                  color: "var(--text-primary, #ffffff)",
                }}
              >
                <span>{customization.statusEmoji || "⚡"}</span>
                <span>{customization.statusText}</span>
              </div>
            )}
          </div>

          {/* Биография / О себе */}
          {customization.bio && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--surface-raised, rgba(255,255,255,0.04))",
                border: "1px solid var(--border, rgba(255,255,255,0.06))",
                fontSize: "12.5px",
                lineHeight: "1.5",
                color: "var(--text-secondary, #d4d4d8)",
                fontStyle: "italic",
              }}
            >
              "{customization.bio}"
            </div>
          )}

          {/* Сетка ключевых показателей (MMR, серия, карточки, ресурсы) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            <div
              style={{
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: "var(--surface-raised, rgba(255,255,255,0.04))",
                border: "1px solid var(--border, rgba(255,255,255,0.06))",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                Рейтинг MMR
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: currentRankTier.color,
                  marginTop: "2px",
                }}
              >
                {profile?.mmr ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: "var(--surface-raised, rgba(255,255,255,0.04))",
                border: "1px solid var(--border, rgba(255,255,255,0.06))",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                Слов SRS
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#3b82f6",
                  marginTop: "2px",
                }}
              >
                {profile?.stats?.cardsCount ?? profile?.cardsCount ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: "var(--surface-raised, rgba(255,255,255,0.04))",
                border: "1px solid var(--border, rgba(255,255,255,0.06))",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                Темы & Ресурсы
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#10b981",
                  marginTop: "2px",
                }}
              >
                {profile?.stats?.resourcesCount ?? profile?.resourcesCount ?? 0}
              </div>
            </div>
          </div>

          {/* Дата регистрации */}
          {joinedDate && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11.5px",
                color: "var(--text-muted)",
              }}
            >
              <Calendar size={13} />
              <span>Участник KaVault с {joinedDate}</span>
            </div>
          )}

          {/* Сообщение о результате действий */}
          {actionMsg && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                color: "#93c5fd",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {actionMsg}
            </div>
          )}

          {/* КНОПКИ ВЗАИМОДЕЙСТВИЯ (Дружба / Редактирование) */}
          <div style={{ marginTop: "4px", display: "flex", gap: "10px" }}>
            {profile?.relationStatus === "SELF" ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/profile");
                }}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--accent, #3b82f6)",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Edit3 size={15} />
                <span>Настроить мой профиль</span>
              </button>
            ) : profile?.relationStatus === "FRIENDS" ? (
              <div style={{ display: "flex", width: "100%", gap: "8px" }}>
                <div
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#34d399",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <UserCheck size={16} />
                  <span>У вас в друзьях</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFriend}
                  disabled={actionLoading}
                  title="Удалить из друзей"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    color: "#f87171",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <UserMinus size={15} />
                </button>
              </div>
            ) : profile?.relationStatus === "PENDING_SENT" ? (
              <div
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  color: "#fbbf24",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <Clock size={15} />
                <span>Заявка в друзья отправлена</span>
              </div>
            ) : profile?.relationStatus === "PENDING_RECEIVED" ? (
              <div style={{ display: "flex", width: "100%", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleRespondRequest(true)}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <UserCheck size={16} />
                  <span>Принять дружбу</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRespondRequest(false)}
                  disabled={actionLoading}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Отклонить
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSendRequest}
                disabled={actionLoading}
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--accent, #3b82f6)",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                }}
              >
                <UserPlus size={16} />
                <span>{actionLoading ? "Отправка..." : "Добавить в друзья"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
