import './App.css'
import { useState } from 'react'
import CodeMirror, { type BasicSetupOptions } from '@uiw/react-codemirror'
import { filterDSL } from './extensions/filter-dsl'
import { dslSyntaxHighlight } from './extensions/syntax-highlight'
import { dslAutocompletion } from './extensions/autocomplete'
import { dslLinter } from './extensions/lint'
import { transformToAST } from './helpers/transform-ast'
import type { ViewUpdate } from '@codemirror/view'

const setup: BasicSetupOptions = {
  lineNumbers: false,
  foldGutter: false,
  highlightActiveLine: false,
}

export function App() {
  const [code, setCode] = useState('')

  const handleChange = (value: string, viewUpdate: ViewUpdate) => {
    setCode(value)
    console.log("transformToAST", transformToAST(viewUpdate.state))
  }

  return (
    <div className="container">
      <div className="content">
        <CodeMirror
          value={code}
          onChange={handleChange}
          className='editor'
          basicSetup={setup}
          extensions={[filterDSL, dslSyntaxHighlight, dslAutocompletion, dslLinter]}
        />
      </div>
    </div>
  )
}

