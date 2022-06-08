class QuickCopy {
    constructor() {
        this.matcher = /^claim/;
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
                            window.granite.debug("That system is owned by your team! " + selected.name);
                        }
                    }
                    else if(selected.status === "inhabited_neutral") {
                        preface = "dominion";
                    }
                    else if(selected.status === "inhabited_dominion") {
                        if(selected.owner.faction_id !== window.gamestate.game.player.faction_id) {
                            preface = "enemy " + preface;
                        }
                        else {
                            window.granite.debug("That system is owned by your team! " + selected.name);
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
                        }
                    });
                }
                else {
                    // nothing selected? Maybe call out enemies in area?
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