import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle, useRef } from 'react'
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

export const SharedTextfieldTipTapEditor = forwardRef(({name,
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
    const isMounted = useRef(true);
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

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const getMultilineText = useCallback(
        ({ content }) => {
            let result = ``;
            if(content.length === 1) return content[0].content ? content[0].content[0].text : '';
            content.forEach((p, i) => {
                if(p.content){
                    if(i === content.length - 1) result+= `${p.content[0].text}`;
                    else result+= `${p.content[0].text}\n`;
                } else {
                    if(i === content.length - 1) result+= ``;
                    else result += `\n`;
                }
            });
            return result;
        },
        [],
    )

    const getText = useCallback(
        () => {
            if(editor) return multiline ? getMultilineText(editor.getJSON()) : htmlToText(editor.getHTML().toString()).trim().toString();
        },
        [editor, multiline, getMultilineText],
    );

    const setText = useCallback(
        (value) => {
            let htmlString = '';
            if(multiline){
                value.toString().split('\n').forEach((line)=>{
                    htmlString += `<p>${line}</p>`;
                });
            }
            editor?.commands.first(({ commands }) => [
                () => commands.setContent(multiline ? htmlString : value.toString()),
            ]);
        },
        [editor, multiline],
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

    useEffect(() => {
        if(!editor){
            if(isMounted.current){
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
                        if(isMounted.current) {
                            const text = multiline ? getMultilineText(event.editor.getJSON()) : htmlToText(event.editor.getHTML().toString()).toString();
                            let value = (type === 'number' && !isNaN(text)) ? parseInt(text) : text;
                            if(onChange && getMultilineText(event.transaction.docs[0].toJSON()) !== text) onChange({
                                target : {
                                    name,
                                    type,
                                    value: (type === 'number' && isNaN(value)) ? 0 : value,
                                }
                            });
                        }
                    },
                    onFocus: ({editor, event}) => {
                        if(isMounted.current) setFocused(true);
                    },
                    onBlur: ({editor, event}) => {
                        if(isMounted.current) {
                            setFocused(false);
                        }
                    },
                }));
            }
        }
    }, [editor, doc, max, maxLength, min, multiline, name, onChange, provider, type, user, getMultilineText]);

    useEffect(() => {
        if(editor){
            if (provider.synced) {
                if(!synced){
                    const text = getText();
                    if (text === '') {
                        if(isMounted.current) {
                            setText(initialvalue);
                            if(onSynced) onSynced(text, setText);
                            setSynced(true);
                        }
                    }
                }
            } else {
                provider.once('synced', () => {
                    if(!synced){
                        const text = getText();
                        if (text === '') {
                            if(isMounted.current) {
                                setText(initialvalue);
                                if(onSynced) onSynced(text, setText);
                                setSynced(true);
                            }
                        }
                    }
                })
            }
        } 
    }, [editor, provider.synced, getText, initialvalue, onSynced, provider, setText, synced]);

    const handleIncrement = useCallback(
        () => {
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
        },
        [editor, type, setText, onChange, max, getText, min, name],
    );

    const handleDecrement = useCallback(
        () => {
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
        },
        [editor, type, setText, onChange, min, getText, name],
    );

    if(!editor){
        return (<div>Conectando...</div>);
    }

    return <div className={classes.root}>
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
    </div>;
});

const initialValuePropsAreEqual = (prevProps, nextProps) => {
    return prevProps.initialvalue === nextProps.initialvalue;
}

export const MemorizedSharedTextfieldTipTapEditor = React.memo(SharedTextfieldTipTapEditor, initialValuePropsAreEqual);