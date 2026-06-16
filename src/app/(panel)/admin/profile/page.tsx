"use client";

import { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe } from "react-icons/fi";
import { Home } from "lucide-react";
import { api } from "@/services/api.client";
import Breadcrumb from "@/components/Breadcrumbs";
import "./profile.css";

type ProfileData = {
  store_name: string; store_email: string; store_phone: string;
  currency: string; gst_number: string;
};

const val = (v?: string) => v?.trim() || "—";

const Field = ({ icon: Icon, label, value, accent = "#6366f1" }: {
  icon: React.ElementType; label: string; value: string; accent?: string;
}) => (
  <div className="pv-field">
    <div className="pv-field-icon" style={{ "--accent": accent } as React.CSSProperties}>
      <Icon size={13} />
    </div>
    <div className="pv-field-body">
      <span className="pv-field-label">{label}</span>
      <span className={`pv-field-value${value === "—" ? " pv-empty" : ""}`}>{value}</span>
    </div>
  </div>
);

const Section = ({ dot, title, children }: { dot: string; title: string; children: React.ReactNode }) => (
  <div className="card pv-card">
    <div className="card-header pv-card-header">
      <div className="pv-dot" style={{ background: dot }} />
      <span className="card-title mb-0">{title}</span>
    </div>
    <div className="card-body pv-card-body">{children}</div>
  </div>
);

const ProfileViewComponent = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    (async () => {
      const res = await api.get<any>("/settings");
      if (res.status && res.data) setProfile(res.data);
      setLoading(false);
    })();
  }, []);

  if (!mounted) return null;

  const p = profile;
  const fullName = p?.store_name || "Admin";

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="ps-page-header" style={{ marginBottom: 24 }}>
          <Breadcrumb
            title="Profile"
            items={[
              { icon: <Home size={13} /> },
              { label: "Manage" },
              { label: "Profile" },
            ]}
          />
        </div>

        {loading ? (
          <div className="pv-layout">
            <div className="pv-skel" style={{ height: 280, borderRadius: 16 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[6, 2].map((cols, i) => (
                <div key={i} className="card pv-card">
                  <div className="pv-card-header" style={{ height: 46 }} />
                  <div className="pv-card-body">
                    <div className="pv-fields-grid">
                      {Array.from({ length: cols }).map((_, j) => (
                        <div key={j} className="pv-skel" style={{ height: 54 }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pv-layout">
            <div className="pv-hero-wrapper">
              <div className="pv-hero">
                <div className="pv-hero-banner" />
                <div className="pv-hero-inner">
                  <div className="pv-avatar" style={{ background: "#2e7d32", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="pv-hero-name">{fullName}</p>
                  </div>
                  <div className="pv-hero-hr" />
                  <div className="pv-hero-stats">
                    <div className="pv-hero-stat">
                      <span className="pv-hero-stat-lbl">Email</span>
                      <span className="pv-hero-stat-val">{val(p?.store_email)}</span>
                    </div>
                    <div className="pv-hero-stat">
                      <span className="pv-hero-stat-lbl">Phone</span>
                      <span className="pv-hero-stat-val">{val(p?.store_phone)}</span>
                    </div>
                    <div className="pv-hero-stat">
                      <span className="pv-hero-stat-lbl">Currency</span>
                      <span className="pv-hero-stat-val">{val(p?.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Section dot="#2e7d32" title="Store Information">
                <div className="pv-fields-grid">
                  <Field icon={FiUser} label="Store Name" value={val(p?.store_name)} accent="#2e7d32" />
                  <Field icon={FiMail} label="Email" value={val(p?.store_email)} accent="#388e3c" />
                  <Field icon={FiPhone} label="Phone" value={val(p?.store_phone)} accent="#2e7d32" />
                  <Field icon={FiGlobe} label="Currency" value={val(p?.currency)} accent="#388e3c" />
                  <Field icon={FiMapPin} label="GST Number" value={val(p?.gst_number)} accent="#2e7d32" />
                </div>
              </Section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewComponent;
