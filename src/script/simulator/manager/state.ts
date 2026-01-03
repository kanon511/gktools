import { Card } from "@/script/simulator/objects/card";
import { Effect } from "@/script/simulator/objects/effect";
import { State } from "@/script/simulator/objects/state";

export class StateManager {
    draw_pile: Card[];
    discard_pile: Card[];
    hand_pile: Card[];
    removed_pile: Card[];

    effect_list: Effect[];
    effect_dict: { [name: string]: Effect };

    turn_type_list: string[];
    current_turn: number;
    extra_turn: number;
    turn_multiplier: { [turn_type: string]: number };

    constructor() {
        this.draw_pile = [];
        this.discard_pile = [];
        this.hand_pile = [];
        this.removed_pile = [];

        this.effect_list = [];
        this.effect_dict = {};

        this.turn_type_list = [];
        this.current_turn = 0;
        this.extra_turn = 0;
        this.turn_multiplier = {};
    }

    copy(): StateManager {
        return new StateManager();
    }

    get_evaluation(): number {
        return 0;
    }

    get_final_effect(): Effect[] {
        return [];
    }
}