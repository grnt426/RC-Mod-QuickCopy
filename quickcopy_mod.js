class QuickCopy {
    constructor() {
        this.matcher = /^copy/;
        this.name = "QuickCopy";
    }

    chatMessage(message) {
        if(this.matcher.test(message)) {
            try {
                let selected = window.gamestate.game.selectedSystem;
                if(selected) {
                    let preface = "system";
                    if(selected.status === "inhabited_player") {
                        if(selected.owner.faction_id !== window.gamestate.game.player.faction_id) {
                            preface = "enemy " + preface;
                        }
                        else {
                            preface = "friendly owned " + preface;
                        }
                    }
                    else if(selected.status === "inhabited_neutral") {
                        preface = "dominion";
                    }
                    else if(selected.status === "inhabited_dominion") {
                        if(selected.owner.faction_id !== window.gamestate.game.player.faction_id) {
                            preface = "enemy dominion";
                        }
                        else {
                            preface = "friendly owned dominion";
                        }
                    }

                    let position = selected.position;
                    let x = Math.round(position.x);
                    let y = Math.round(position.y);
                    let sector = window.gamestate.game.galaxy.sectors[selected.sector_id];
                    let content = `${preface} ${selected.name.toUpperCase()} (${x}, ${y}) in ${sector.name.toUpperCase()}`;
                    navigator.clipboard.writeText(content).then(r => {
                        if(r) {
                            window.granite.debug("Failed to write to clipboard: " + r, window.granite.levels.ERROR);
                            window.granite.showMessageInChat("M:" + this.name, "Error in copying: " + r);
                        }
                        else {
                            window.granite.showMessageInChat("M:" + this.name, "Copied!");
                        }
                    });
                }
                else {
                    // nothing selected? Maybe call out enemies in area?
                    window.granite.showMessageInChat("M:" + this.name, "You need to select a system first!");
                }
            }
            catch(err) {
                window.granite.debug("Failed to parse system lookup: " + err, window.granite.levels.ERROR);
            }
            return true;
        }

        return false;
    }
}

window.granite.addHookListener(new QuickCopy());