import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Editor } from '@tiptap/core'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { EditorContent } from '@tiptap/react'
import { useSharedDocContext } from 'contexts/SharedDocContext'
import './sharedTextField.css';
import { Box, ButtonBase, Divider, makeStyles } from '@material-ui/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import CharacterCount from '@tiptap/extension-character-count'
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons'

function htmlToText(htmlString) {
    var span = document.createElement('span');
    span.innerHTML = htmlString;
    return span.textContent || span.innerText;
};

const useStyles = makeStyles((theme) => ({
    root: ({ multiline, rowMax, focused }) => ({
        width: '100%',
        display: 'flex',
    }),
    inputContainer: ({ multiline, rowMax, focused, type }) => ({
        width: '100%',
        cursor: 'text',
        height: multiline && rowMax === 1 ? 'auto' : `calc(22px * ${rowMax} + 34px)`,
        overflow: 'auto',
    }),
    actions: () => ({
        display: 'flex',
        flexDirection: 'column',
        width: 70,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.action.disabled,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    }),
    action: () => ({
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    }),
    editorx: ({ multiline, rowMax }) => ({
        height: multiline && rowMax === 1 ? 'auto' : `calc(22px * ${rowMax} + 34px)`,
    }),
    '@global': {
        '.ProseMirror': ({ multiline, rowMax }) => ({
            height: '100%',
            overflow: 'auto',
            overflowX: 'hidden',
            width: '100%',
            fontSize: theme.typography.body1.fontSize,
            fontFamily: theme.typography.fontFamily,
            fontStyle: 'normal',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            paddingLeft: 10,
            paddingRight: 10,
        }),
        '.ProseMirror p': {
            marginBlockStart: 0,
            marginBlockEnd: 0,
        },
        '.ProseMirror:focus': {
            outline: 'none',
        },
        '.ProseMirror p.is-editor-empty:first-child::before': {
            content: 'attr(data-empty-text)',
            float: 'left',
            color: theme.palette.type === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600],
            pointerEvents: 'none',
            height: 0,
        },
    },
}));

export const SharedTextFieldTipTapEditor = forwardRef(({name,
    multiline,
    rowMax = 1,
    maxLength,
    onChange,
    placeholder = '',
    initialvalue = '',
    type = 'text',
    max,
    min,
    deleteOnRemove = false,
    onSynced,
}, ref) => {
    const [focused, setFocused] = useState(false);
    const classes = useStyles({
        multiline,
        rowMax,
        focused,
        type,
    });
    const [synced, setSynced] = useState(false);
    const { doc, provider, user } = useSharedDocContext();
    const [editor, setEditor] = useState(null);

    const getText = useCallback(
        () => {
            return htmlToText(editor?.getHTML().toString()).trim().toString();
        },
        [editor],
    );

    const setText = useCallback(
        (value) => {
            editor?.commands.first(({ commands }) => [
                () => commands.setContent(value.toString()),
            ]);
        },
        [editor],
    );

    useImperativeHandle(
        ref,
        () => ({
            clearText: () => {
                if (!doc || !editor) return;
                setText('');
            },
        }),
    );

    useEffect(() => {
        return () => {
            if (!doc || !editor || !deleteOnRemove) return;
            setText('');
        }
    }, [doc, editor, setText, deleteOnRemove]);

    if(!editor){
        setEditor(new Editor({
            editorProps: type === 'number' ? {
                handleTextInput: (view, from, to, text) => {
                    if (isNaN(text) && text !== '-') return true;
                    if (text === '0' && view.dom.firstChild.textContent === '00') return true;
                    if (
                        (text === '-' && view.dom.firstChild.textContent.match(/-/g).length > 1) || 
                        (text === '-' && min !== null && min >= 0) ||
                        (text === '-' && view.dom.firstChild.textContent.indexOf('-') !== 0) 
                    ) return true;
                    if (max !== null && parseInt(view.dom.firstChild.textContent) > max) return true;
                    if (min !== null && parseInt(view.dom.firstChild.textContent) < min) return true;
                    return false;
                },
                handlePaste: (view, event, slice) => {
                    if (slice.content.childCount !== 1) return true;
                    if (isNaN(slice.content.firstChild.textContent)) return true;
                    const prevValue = view.dom.firstChild.textContent;
                    const newValue = prevValue + slice.content.firstChild.textContent;
                    if (
                        (newValue.includes('-') && newValue.match(/-/g)?.length > 1) ||
                        (newValue.includes('-') && newValue.indexOf('-') !== 0)
                    ) return true;                    
                    if (max !== null && parseInt(newValue) > max) return true;
                    if (min !== null && parseInt(newValue) < min) return true;
                    return false;
                },
            } : {},
            extensions: [
                Document.extend({
                    content: multiline ? 'block+' : 'block',
                }),
                Paragraph,
                Text,
                CollaborationCursor.configure({
                    provider: provider,
                    user,
                }),
                Collaboration.configure({
                    document: doc,
                    field: name,
                }),
                CharacterCount.configure({
                    limit: maxLength,
                }),
            ],
            onUpdate: (event) => {
                const text = htmlToText(event.editor.getHTML().toString());
                let value = (type === 'number' && !isNaN(text)) ? parseInt(text) : text;
                if(onChange && event.transaction.docs[0].textContent !== text) onChange({
                    target : {
                        name,
                        type,
                        value: (type === 'number' && isNaN(value)) ? 0 : value,
                    }
                });
            },
            onFocus: ({editor, event}) => {
                setFocused(true);
            },
            onBlur: ({editor, event}) => {
                setFocused(false);
            },
        }));
    }
    useEffect(() => {
        if (provider.synced) {
            if(!synced){
                if (getText() === '') {
                    setText(initialvalue);
                    if(onSynced) onSynced();
                    setSynced(true);
                }
            }
        } else {
            provider.once('synced', () => {
                if(!synced){
                    if (getText() === '') {
                        setText(initialvalue);
                        if(onSynced) onSynced();
                        setSynced(true);
                    }
                }
            })
        }
    }, [provider.synced, getText, initialvalue, onSynced, provider, setText, synced]);

    if(!editor){
        return (<div>Conectando...</div>);
    }

    const handleIncrement = () => {
        let val = getText();
        if (!editor || type !== 'number') return;
        if (!val.length || val === '-') return setText(min ?? 0);
        val = parseInt(val);
        if (max !== null && (val + 1 > max)) return;
        if(onChange) onChange({
            target : {
                name,
                type,
                value: (type === 'number' && isNaN(val)) ? 0 : val + 1,
            }
        });
        return setText(val + 1);
    };

    const handleDecrement = () => {
        let val = getText();
        if (!editor || type !== 'number') return;
        if (!val.length || val === '-') return setText(min ?? 0);
        val = parseInt(val);
        if (min !== null && (val - 1 < min)) return;
        if(onChange) onChange({
            target : {
                name,
                type,
                value: (type === 'number' && isNaN(val)) ? 0 : val - 1,
            }
        });
        return setText(val - 1);
    };

    return (
        <div className={classes.root}>
            <div className={classes.inputContainer} onClick={() => {
                if (!focused) editor.chain().focus('end').run()
            }}>
                <EditorContent editor={editor} className={`${classes.editorx}`} />
            </div>
            {
                type === 'number' && (
                    <div className={classes.actions}>
                        <Box className={classes.action} component={ButtonBase} onClick={handleIncrement}>
                            <ArrowDropUp />
                        </Box>
                        <Divider />
                        <Box className={classes.action} component={ButtonBase} onClick={handleDecrement}>
                            <ArrowDropDown />
                        </Box>
                    </div>
                )
            }
        </div>
    )
})
