import { injectable, inject } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from "@theia/core/lib/common";
import { open, KeybindingContribution, KeybindingRegistry, FrontendApplicationContribution, QuickOpenService, Endpoint, QuickOpenItem, QuickOpenMode, StatusBar, QuickOpenContribution, QuickOpenHandlerRegistry, OpenerService , CommonMenus, StatusBarAlignment} from "@theia/core/lib/browser";
import { WorkspaceService } from "@theia/workspace/lib/browser";


export const TheiaQuickCommand = {
    id: 'quick-cmd',
    label: 'my-quick-cmd'
}



@injectable()
export class TheiaTrainingFrontendContribution implements CommandContribution, MenuContribution, KeybindingContribution, FrontendApplicationContribution, QuickOpenContribution {

    readonly prefix = 'file';

    readonly description = 'Quick File'

    @inject(QuickOpenService)
    protected readonly quickOpenService: QuickOpenService;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(OpenerService)
    protected readonly openereService: OpenerService;

    @inject(StatusBar)
    protected readonly statusBar: StatusBar;







    registerCommands(registry: CommandRegistry): void {

       registry.registerCommand(TheiaQuickCommand, {

           execute: () => {
            let roots:string = this.workspaceService.tryGetRoots()[0].uri
            if(roots != undefined){
                this.open(roots)

            }
           },
           isEnabled: () => {
               let roots:string = this.workspaceService.tryGetRoots()[0].uri
               if(roots!= undefined){
                   return true;
               }else{
                   return false;
               }
           },

           isVisible: () => {
               let roots:string = this.workspaceService.tryGetRoots()[0].uri
               if(roots!= undefined){
                   return true;
               }else{
                  return false;
               }
           }

       });


        // TODO: Add `Open Quick File...` command
        // The command should call `this.open` for the first workspace root, i.e. `this.workspaceService.tryGetRoots()[0]`
        // if there is no workspace root then the command should not be visible and enabled -- DONE
    }

    registerKeybindings(registry: KeybindingRegistry): void {
        // TODO: Add `ctrlcmd+k f` keybinding for `Open Quick File...` command
        registry.registerKeybinding({
            command: 'quick-cmd',
            keybinding: 'ctrlcmd+k f'
        })



    }

    registerMenus(registry: MenuModelRegistry): void {

        registry.registerMenuAction(CommonMenus.FILE_OPEN, {
            label: 'my-quick',
            commandId: 'quick-cmd'
        })
        // TODO: Add `Open Quick File...` menu item in `CommonMenus.FILE_OPEN` menu path
    }

    onStart(): void {
        this.statusBar.setColor("red");
        this.statusBar.setElement("my-quick",{
            color: 'red',
            text: '$(ad)',
            tooltip: 'test',
            alignment: StatusBarAlignment.LEFT
        })
        // TODO: Add `Open Quick File...` status bar item with file icon aligned left
    }

    registerQuickOpenHandlers(handlers: QuickOpenHandlerRegistry): void {
        /* BONUS: reimplement like QuickOpenHandler */
        // handlers.registerHandler(this);
    }

    protected async open(current: string, path: string[] = []): Promise<void> {
        const listFilesUrl = new Endpoint({ path: 'listFiles' }).getRestUrl();
        const url = listFilesUrl.withQuery(current).toString();
        const response = await fetch(url);
        const files: string[] = await response.json();
        const items: QuickOpenItem[] = files.map(file => new QuickOpenItem({
            label: file,
            run: mode => {
                if (mode === QuickOpenMode.OPEN) {
                    const currentUri = new URI(current);
                    const fileUri = currentUri.withPath(currentUri.path.join(file));
                    if (fileUri.path.ext && fileUri.path.name) {
                        open(this.openereService, fileUri);
                    } else {
                        path.push(current);
                        this.open(fileUri.toString(true), path);
                    }
                    return true;
                }
                return false;
            }
        }));
        if (path.length) {
            items.unshift(new QuickOpenItem({
                label: '..',
                run: mode => {
                    if (mode === QuickOpenMode.OPEN) {
                        this.open(path.pop()!, path);
                        return true;
                    }
                    return false;
                }
            }));
        }
        this.quickOpenService.open({
            onType: (_, acceptor) => acceptor(items)
        }, {
            fuzzyMatchLabel: true,
            placeholder: 'Type file name...'
        });
    }

}