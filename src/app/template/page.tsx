"use client";

import { useState } from "react";
import TemplateHeader from "@/components/template/template-header";
import TemplateSidebar from "@/components/template/template-sidebar";
import TemplateGrid from "@/components/template/template-grid";
import PromptEditor from "@/components/template/prompt-editor";
import type { PromptTemplate } from "@/types/template";
import TemplateSettingsModal from "@/components/template/template-settings-modal";

export default function TemplatePage() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<PromptTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };

  const handleEditTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedTemplate(null);
  };

  const handleQuickAccess = (action: string) => {
    switch (action) {
      case "recent":
        setSelectedCategory("recent");
        break;
      case "favorites":
        setSelectedCategory("favorites");
        break;
      case "settings":
        setIsSettingsOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800">
      <div className="flex">
        {/* Sidebar */}
        <TemplateSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onQuickAccess={handleQuickAccess}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <TemplateHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCreateNew={handleCreateNew}
          />

          {/* Content */}
          <main className="flex-1 p-6">
            <TemplateGrid
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onEditTemplate={handleEditTemplate}
            />
          </main>
        </div>
      </div>

      {/* Prompt Editor Modal */}
      {isEditorOpen && (
        <PromptEditor template={selectedTemplate} onClose={handleCloseEditor} />
      )}

      {/* Template Settings Modal */}
      <TemplateSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
