import type { GameObj } from "kaplay";
import { getObjectInfo } from "../lib/get-object-info";
import { useApp } from "../lib/app-context";

interface BreadcrumbsProps {
  obj: GameObj;
}

export const Breadcrumbs = ({ obj }: BreadcrumbsProps) => {
  const { k, setRoot } = useApp();
  const breadcrumbs = [];

  if (obj.exists()) {
    let parent = obj.parent;

    while (parent) {
      const { tags, compsLabel } = getObjectInfo(parent);

      breadcrumbs.unshift({
        id: parent.id,
        tags,
        compsLabel,
        object: parent,
      });

      parent = parent.parent;
    }
  } else {
    const root = k.getTreeRoot();

    breadcrumbs.push({
      id: root.id,
      tags: "Root",
      compsLabel: "Root",
      object: root,
    });
  }

  return (
    <div class="breadcrumbs">
      Back to
      {breadcrumbs.map((breadcrumb) => (
        <button
          key={breadcrumb.id}
          class="ki-btn breadcrumbs__item"
          onClick={() => setRoot(breadcrumb.object)}
        >
          ID {breadcrumb.id}: {breadcrumb.tags || breadcrumb.compsLabel}
        </button>
      ))}
    </div>
  );
};
