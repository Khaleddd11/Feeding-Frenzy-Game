let CollisionDetectionPlayerFishAndEnemyFishes = function () {
    const pX = parseInt(fishPlayer.style.left);
    const pY = parseInt(fishPlayer.style.top);
    const pWidth = fishPlayer.width;
    const pHeight = fishPlayer.height;

    for (let i = fishEnemiesList.length - 1; i >= 0; i--) {
        
        let enemy = fishEnemiesList[i];
        // (player left < enemy right) AND (player right > enemy left)
        let hitX = (pX < enemy.x + enemy.width) && (pX + pWidth > enemy.x);

        // (player top < enemy bottom - 20) and (player top > enemy top - player height + 20)
        let hitY = (pY < enemy.y + enemy.height - 20) && (pY > enemy.y - pHeight + 20);

        if (hitX && hitY) {
            
            //  collison
            if (pHeight < enemy.height) {
                if(enemy.direction === "left") enemy.element.src = enemy.imgSrc.replace("left", "right");
                else enemy.element.src = enemy.imgSrc.replace("right", "left");
                
                //boom function
               //reset function 
                return; 

            } else {
                container.removeChild(enemy.element);
                //eat sound playEatingSound();
                score++;
                

                fishEnemiesList.splice(i, 1);
                //remove funciton removeFishRandomMotion(i);
            }
        }
    }
};