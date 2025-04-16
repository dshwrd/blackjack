import { GameOverMessages, GameOverSubMessages } from '../utils/Enums';
import { Game } from '../game/Game';
import { Player } from '../game/player/Player';
import { BlackJackScence } from '../ui/BlackJackScene';
import { IState } from './IState';
import { CardHelper } from '../utils/CardHelper';
import { DEALER_CARD_Y_POSITION } from '../utils/Constants';

export class GameOverState implements IState {
    public name: string = 'GameOverState';
    private messaging: string = '';

    public enter(): void {
        console.log('Entering Game Over State');

        this.determineWinner();
        BlackJackScence.getInstance().toggleMessageScreen();
        this.checkIfWeNeedToFlipOverDealerCard();
    }

    public exit(): void {
        console.log('Exiting Game Over State');
    }

    private determineWinner(): void {
        let player: Player = Game.getInstance().getPlayer();
        let dealer: Player = Game.getInstance().getDealer();

        if (player.getHand().isBlackjack() && !dealer.getHand().isBlackjack()) {
            this.messaging = GameOverMessages.PLAYER_BLACKJACK;
        } else if (player.getHand().isBust()) {
            this.messaging = GameOverMessages.PLAYER_BUST;
        } else if (dealer.getHand().isBust()) {
            this.messaging = GameOverMessages.DEALER_BUST;
        } else if (Game.getInstance().checkIfPush()) {
            this.messaging = GameOverMessages.PUSH;
        } else if (player.getHand().calculateValue() > dealer.getHand().calculateValue()) {
            this.messaging = GameOverMessages.PLAYER_WINS;
        } else if (player.getHand().calculateValue() < dealer.getHand().calculateValue()) {
            this.messaging = GameOverMessages.DEALER_WINS;
        } else {
            this.messaging = GameOverMessages.DEFAULT
        }

        BlackJackScence.getInstance().updateGameOverScreen(this.messaging);
        BlackJackScence.getInstance().updateGameOverSubScreen(
            GameOverSubMessages.PLAYER + player.getHand().calculateValue() + 
            GameOverSubMessages.VS + 
            GameOverSubMessages.DEALER + dealer.getHand().calculateValue()
        );
    }

    private checkIfWeNeedToFlipOverDealerCard(): void {
        console.log('Rotation: ' + Game.getInstance().getDealer().getCardMeshes()[1].rotation.y);
        if (Game.getInstance().getDealer().getCardMeshes()[1].rotation.y === Math.PI) {
            CardHelper.getInstance().animateCard(Game.getInstance().getDealer().getCardMeshes()[1], 0, DEALER_CARD_Y_POSITION, () => {});
        }
    }
}