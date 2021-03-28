import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'

export default Extension.create({
  name: 'placeholder',

  defaultOptions: {
    emptyEditorClass: 'is-editor-empty',
    emptyNodeClass: 'is-empty',
    placeholder: 'Placeholder',
    showOnlyWhenEditable: true,
    showOnlyCurrent: true,
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc, selection }) => {
            const active = this.editor.isEditable || !this.options.showOnlyWhenEditable
            const { anchor } = selection
            const decorations = []
            const isEditorEmpty = doc.textContent.length === 0

            if (!active) {
              return
            }

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= (pos + node.nodeSize)
              // TODO: should be false for image nodes (without text content), is true though
              const isNodeEmpty = node.content.size === 0

              if ((hasAnchor || !this.options.showOnlyCurrent) && isNodeEmpty) {
                const classes = [this.options.emptyNodeClass]

                if (isEditorEmpty) {
                  classes.push(this.options.emptyEditorClass)
                }

                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(' '),
                  'data-empty-text': typeof this.options.placeholder === 'function'
                    ? this.options.placeholder(node)
                    : this.options.placeholder,
                })
                decorations.push(decoration)
              }

              return false
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})