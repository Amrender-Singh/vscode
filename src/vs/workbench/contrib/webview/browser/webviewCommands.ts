/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from 'vs/base/common/actions';
import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import * as nls from 'vs/nls';
import { Action2 } from 'vs/platform/actions/common/actions';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_FOCUSED, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_VISIBLE } from 'vs/workbench/contrib/webview/browser/webview';
import { WebviewEditor } from 'vs/workbench/contrib/webview/browser/webviewEditor';
import { IEditorService } from 'vs/workbench/services/editor/common/editorService';
import { InputFocusedContextKey } from 'vs/platform/contextkey/common/contextkeys';

export class ShowWebViewEditorFindWidgetAction extends Action2 {
	public static readonly ID = 'editor.action.webvieweditor.showFind';
	public static readonly LABEL = nls.localize('editor.action.webvieweditor.showFind', "Show find");

	constructor(contextKeyExpr: ContextKeyExpr) {
		super({
			id: ShowWebViewEditorFindWidgetAction.ID,
			title: ShowWebViewEditorFindWidgetAction.LABEL,
			keybinding: {
				when: contextKeyExpr,
				primary: KeyMod.CtrlCmd | KeyCode.KEY_F,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor): void {
		getActiveWebviewEditor(accessor)?.showFind();
	}
}

export class HideWebViewEditorFindCommand extends Action2 {
	public static readonly ID = 'editor.action.webvieweditor.hideFind';
	public static readonly LABEL = nls.localize('editor.action.webvieweditor.hideFind', "Stop find");

	constructor(contextKeyExpr: ContextKeyExpr) {
		super({
			id: HideWebViewEditorFindCommand.ID,
			title: HideWebViewEditorFindCommand.LABEL,
			keybinding: {
				when: ContextKeyExpr.and(contextKeyExpr, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_VISIBLE),
				primary: KeyCode.Escape,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor): void {
		getActiveWebviewEditor(accessor)?.hideFind();
	}
}

export class WebViewEditorFindNextCommand extends Action2 {
	public static readonly ID = 'editor.action.webvieweditor.findNext';
	public static readonly LABEL = nls.localize('editor.action.webvieweditor.findNext', 'Find next');

	constructor(contextKeyExpr: ContextKeyExpr) {
		super({
			id: WebViewEditorFindNextCommand.ID,
			title: WebViewEditorFindNextCommand.LABEL,
			keybinding: {
				when: ContextKeyExpr.and(contextKeyExpr, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_FOCUSED),
				primary: KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor): void {
		getActiveWebviewEditor(accessor)?.find(false);
	}
}

export class WebViewEditorFindPreviousCommand extends Action2 {
	public static readonly ID = 'editor.action.webvieweditor.findPrevious';
	public static readonly LABEL = nls.localize('editor.action.webvieweditor.findPrevious', 'Find previous');

	constructor(contextKeyExpr: ContextKeyExpr) {
		super({
			id: WebViewEditorFindPreviousCommand.ID,
			title: WebViewEditorFindPreviousCommand.LABEL,
			keybinding: {
				when: ContextKeyExpr.and(contextKeyExpr, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_FOCUSED),
				primary: KeyMod.Shift | KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor): void {
		getActiveWebviewEditor(accessor)?.find(true);
	}
}

export class SelectAllWebviewEditorCommand extends Action2 {
	public static readonly ID = 'editor.action.webvieweditor.selectAll';
	public static readonly LABEL = nls.localize('editor.action.webvieweditor.selectAll', 'Select all');

	constructor(contextKeyExpr: ContextKeyExpr) {
		const precondition = ContextKeyExpr.and(contextKeyExpr, ContextKeyExpr.not(InputFocusedContextKey));
		super({
			id: SelectAllWebviewEditorCommand.ID,
			title: SelectAllWebviewEditorCommand.LABEL,
			keybinding: {
				when: precondition,
				primary: KeyMod.CtrlCmd | KeyCode.KEY_A,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, args: any): void {
		getActiveWebviewEditor(accessor)?.selectAll();
	}
}

export class ReloadWebviewAction extends Action {
	static readonly ID = 'workbench.action.webview.reloadWebviewAction';
	static readonly LABEL = nls.localize('refreshWebviewLabel', "Reload Webviews");

	public constructor(
		id: string,
		label: string,
		@IEditorService private readonly editorService: IEditorService
	) {
		super(id, label);
	}

	public run(): Promise<any> {
		for (const webview of this.getVisibleWebviews()) {
			webview.reload();
		}
		return Promise.resolve(true);
	}

	private getVisibleWebviews() {
		return this.editorService.visibleControls
			.filter(control => control && (control as WebviewEditor).isWebviewEditor)
			.map(control => control as WebviewEditor);
	}
}

export function getActiveWebviewEditor(accessor: ServicesAccessor): WebviewEditor | undefined {
	const editorService = accessor.get(IEditorService);
	const activeControl = editorService.activeControl as WebviewEditor | undefined;
	return activeControl?.isWebviewEditor ? activeControl : undefined;
}
