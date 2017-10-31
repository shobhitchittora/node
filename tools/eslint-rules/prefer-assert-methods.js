/**
 * @fileoverview Prohibit the use of assert operators ( ===, !==, ==, != )
 */

'use strict';

function isAssert(node) {
  return node.expression &&
    node.expression.type === 'CallExpression' &&
    node.expression.callee &&
    node.expression.callee.name === 'assert';
}

function getFirstArg(expression) {
  return expression.arguments && expression.arguments[0];
}

function parseError(method, op) {
  return `'assert.${method}' should be used instead of '${op}'`;
}

const preferedAssertMethod = {
  '===': 'strictEqual',
  '!==': 'notStrictEqual',
  '==': 'equal',
  '!=': 'notEqual'
};

module.exports = function(context) {
  return {
    ExpressionStatement(node) {
      if (isAssert(node)) {
        const arg = getFirstArg(node.expression);
        if (arg && arg.type === 'BinaryExpression') {
          const assertMethod = preferedAssertMethod[arg.operator];
          if (assertMethod) {
            context.report({
              node,
              message: parseError(assertMethod, arg.operator),
              fix: (fixer) => {
                const sourceCode = context.getSourceCode();
                const left = sourceCode.getText(arg.left);
                const right = sourceCode.getText(arg.right);

                return fixer.replaceText(
                  node,
                  `assert.${assertMethod}(${left}, ${right})`
                );
              }
            });
          }
        }
      }
    }
  };
};
