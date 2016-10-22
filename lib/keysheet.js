'use babel';

import KeysheetView from './keysheet-view';
import { CompositeDisposable } from 'atom';

export default {

    keysheetView: null,
    subscriptions: null,

    activate(state) {
        this.keysheetView = new KeysheetView(state.keysheetViewState);

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'keysheet:process': () => this.process()
        }));
    },

    // added subscriptions will be disposed of at once.
    deactivate() {
        this.subscriptions.dispose();
    },

    process() {
        var editor;
        if (editor = atom.workspace.getActiveTextEditor()) {
            var text = editor.getText()+"\n\n// keys \n",
                comments = text.match(/<!--[\s\S]*?-->/g),
                originalComment, varName, delimiters;
            comments.forEach((comment)=>{
                originalComment = comment;
                varName = originalComment.match(/::([\s\S]*?)::/);
                delimiters = /<[a-z][\s\S]*>/i.test(originalComment) ? ["{{{","}}}"]:["{{","}}"];
                text = text.replace(originalComment,delimiters[0]+"t '"+varName[1]+"'"+delimiters[1]);
                text+=varName[1]+"	"+originalComment.replace('<!--'+varName[0],'').replace('-->','')+'\n';
            });
        }
        editor.setText(text)
    }

};
