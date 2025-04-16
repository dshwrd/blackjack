import { GameOverMessages, GameOverSubMessages } from '../utils/Enums';
import { Game } from '../game/Game';
import { Player } from '../game/player/Player';
import { UIScene } from '../ui/UIScene';
import { IState } from './IState';
import { CardHelper } from '../utils/CardHelper';
import { DEALER_CARD_Y_POSITION } from '../utils/Constants';

/**
 * Game Over State is when the game is finished and we show who won.
 */
export class GameOverState implements IState {
    public name: string = 'GameOverState';
    private messaging: string = '';

    /**
     * @description Enter the game over state. Figure out the winner and show the game over screen.
     */
    public enter(): void {
        console.log('Entering Game Over State');

        this.determineWinner();
        UIScene.getInstance().toggleMessageScreen();
        // If the dealer's second card isn't flipped over, flip it now.
        this.checkIfWeNeedToFlipOverDealerCard();
    }

    /**
     * Exiting the state, no cleanup is needed for the Game Over State.
     */
    public exit(): void {
        console.log('Exiting Game Over State');
    }

    /**
     * @description Determine the winner of the game. This is done by checking the player's hand and the dealer's hand.
     */
    private determineWinner(): void {
        let player: Player = Game.getInstance().getPlayer();
        let dealer: Player = Game.getInstance().getDealer();

        // Check if the player has blackjack and the dealer does not.
        if (player.getHand().isBlackjack() && !dealer.getHand().isBlackjack()) {
            this.messaging = GameOverMessages.PLAYER_BLACKJACK;
        // Check if the player busted
        } else if (player.getHand().isBust()) {
            this.messaging = GameOverMessages.PLAYER_BUST;
        // Check if the dealer busted
        } else if (dealer.getHand().isBust()) {
            this.messaging = GameOverMessages.DEALER_BUST;
        // Check if it's a push
        } else if (Game.getInstance().checkIfPush()) {
            this.messaging = GameOverMessages.PUSH;
        // Check if the player has the higher hand value
        } else if (player.getHand().calculateValue() > dealer.getHand().calculateValue()) {
            this.messaging = GameOverMessages.PLAYER_WINS;
        // Check if the dealer has the higher hand value
        } else if (player.getHand().calculateValue() < dealer.getHand().calculateValue()) {
            this.messaging = GameOverMessages.DEALER_WINS;
        // This shouldn't ever get hit... but just in case, we can set it to default.
        } else {
            this.messaging = GameOverMessages.DEFAULT
        }

        // Update the game over screen with the winner message.
        UIScene.getInstance().updateGameOverScreen(this.messaging);
        // UPdate the game over screen sub message with the player and dealer hand values.
        UIScene.getInstance().updateGameOverSubScreen(
            GameOverSubMessages.PLAYER + player.getHand().calculateValue() + 
            GameOverSubMessages.VS + 
            GameOverSubMessages.DEALER + dealer.getHand().calculateValue()
        );
    }

    /**
     * @description Check if the dealer's second card is flipped over. If it is, flip it over.
     */
    private checkIfWeNeedToFlipOverDealerCard(): void {
        // rotation.y === 0 is face up, rotation.y === Math.PI is face down.
        // Rotation values are in radians, so we need to check if it's 0 or Math.PI.
        if (Game.getInstance().getDealer().getCardMeshes()[1].rotation.y === Math.PI) {
            CardHelper.getInstance().animateCard(Game.getInstance().getDealer().getCardMeshes()[1], 0, DEALER_CARD_Y_POSITION, () => {});
        }
    }
}