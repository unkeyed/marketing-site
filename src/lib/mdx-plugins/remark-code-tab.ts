import type { Code, Root } from 'mdast';
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import type { Transformer } from 'unified';

/**
 * Remark plugin to group consecutive code blocks with tab meta into CodeTabs
 */
export function remarkCodeTab(): Transformer<Root, Root> {
  return (tree) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newChildren: any[] = [];
    let i = 0;

    while (i < tree.children.length) {
      const node = tree.children[i];

      // Check if this is a code block with tab meta
      if (node.type === 'code' && node.meta && node.meta.includes('tab=')) {
        const tabGroup: Code[] = [node as Code];
        let j = i + 1;

        // Collect consecutive code blocks with tab meta
        while (j < tree.children.length) {
          const nextNode = tree.children[j];
          if (nextNode.type === 'code' && nextNode.meta && nextNode.meta.includes('tab=')) {
            tabGroup.push(nextNode as Code);
            j++;
          } else {
            break;
          }
        }

        // If we have multiple tab blocks, create CodeTabs component
        if (tabGroup.length > 1) {
          // Extract tab data and create a simple structure
          const tabsData = tabGroup.map((codeNode) => {
            const tabMatch = codeNode.meta?.match(/tab="([^"]+)"/);
            const tabName = tabMatch ? tabMatch[1] : codeNode.lang || 'Code';

            // Clean meta from tab attribute
            const cleanMeta = codeNode.meta?.replace(/tab="[^"]*"\s*/, '').trim() || null;

            return {
              label: tabName,
              language: codeNode.lang || 'text',
              code: codeNode.value,
              meta: cleanMeta,
            };
          });

          // Create tabs attribute with stringified data
          const tabsAttribute: MdxJsxAttribute = {
            type: 'mdxJsxAttribute',
            name: 'tabs',
            value: JSON.stringify(tabsData),
          };

          // Create simple CodeTabs wrapper without complex children
          const codeTabsElement: MdxJsxFlowElement = {
            type: 'mdxJsxFlowElement',
            name: 'CodeTabs',
            attributes: [tabsAttribute],
            children: [],
          };

          newChildren.push(codeTabsElement);
          i = j; // Skip all processed nodes
        } else {
          // Single tab block, treat as regular code
          newChildren.push(node);
          i++;
        }
      } else {
        newChildren.push(node);
        i++;
      }
    }

    tree.children = newChildren;
  };
}
