import type { GameObj } from "kaplay";
import { getObjectInfo } from "../lib/get-object-info";

interface BreadcrumbsProps {
  obj: GameObj;
  setRenderRoot: (obj: GameObj) => void;
}

export const Breadcrumbs = ({ obj, setRenderRoot }: BreadcrumbsProps) => {
  const breadcrumbs = [];

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

  // TODO for destroyed objects always add root as a breadcrumb
  // if (breadcrumbs.length === 0) {
  //   const root = k.getTreeRoot()
  //   breadcrumbs.push({
  //     id: root.id,
  //     tags: root.tags,
  //     compsLabel: root.compsLabel,
  //     object: root,
  //   });
  // }

  return (
    <div class="breadcrumbs">
      Back to
      {breadcrumbs.map((breadcrumb) => (
        <button class="ki-btn" onClick={() => setRenderRoot(breadcrumb.object)}>
          ID {breadcrumb.id}: {breadcrumb.tags || breadcrumb.compsLabel}
        </button>
      ))}
    </div>
  );
};
