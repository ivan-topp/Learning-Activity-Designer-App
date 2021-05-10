import React from 'react';
import { Commentary } from './Commentary';
import { CommentaryInput } from './CommentaryInput';
import { useDesignState } from 'contexts/design/DesignContext';

export const DesignComments = () => {
    const { designState } = useDesignState();
    const { design } = designState;

    return (<div>
        {
            design.comments.length !== 0 && design.comments.map((commentary) => <Commentary key={commentary._id} data={commentary}/>)
        }
        <CommentaryInput />
    </div>)
}
