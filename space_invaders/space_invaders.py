import pygame
import random
import math

pygame.init()

screen_x=800
screen_y=500
screen = pygame.display.set_mode((screen_x,screen_y))
clock = pygame.time.Clock()

# title and favicon
pygame.display.set_caption("Space invaders")
icon= pygame.image.load('spaceship.png')
pygame.display.set_icon(icon)

# game=won or lost or running and score
game="running"
score=0

#player and enemy sizes
player_size_x=64
player_size_y=64
enemy_size_x=64
enemy_size_y=64

#player coordinates
player_y= screen_y - player_size_y
player_x = screen_x/2 - player_size_x/2
player_change_x=0 # since player does not change in y coordinate, we do not add y-coordinate for player

# multiple enemies
enemy_img=[]
enemy_x=[]
enemy_y=[]
enemy_change_x=[]
enemy_change_y=[]
no_of_enemies=6

for i in range(no_of_enemies):
#enemy coordinates
  enemy_img.append(pygame.image.load('ghost.png'))
  enemy_x.append(random.randint(0,(screen_x-enemy_size_x)))
  enemy_y.append(random.randint(50, 150))
  enemy_change_x.append(2)
  enemy_change_y.append(40)

# bullet coordinates
bullet_x=0 #because it keeps changing
bullet_y=player_y
bullet_change_y=8
bullet_state= "ready"

# load images
player_img=pygame.image.load('spaceship.png')
bullet_img=pygame.image.load('bullet.png')

# consider two states- (labels)
#  ready= can't see bullet on screen
#  fire= can see bullet and bullet is in motion

#functions
def player(x,y):
  screen.blit(player_img,(x,y))

def enemy(x,y,i):
  screen.blit(enemy_img[i],(x,y))

def fire_bullet(x,y):
  global bullet_state # the function must be global so that it can be changed from anywhere
  # when space bar is pressed, this function is executed and the bullet state changes to fire
  bullet_state="fire"
  screen.blit(bullet_img, (x, y))

#check for collision
def isCollision(enemyX, enemyY, bulletX, bulletY):
    enemy_center_x = enemyX + enemy_size_x / 2
    enemy_center_y = enemyY + enemy_size_y / 2
    bullet_center_x = bulletX + bullet_img.get_width() / 2
    bullet_center_y = bulletY + bullet_img.get_height() / 2
    distance = math.sqrt(math.pow(enemy_center_x - bullet_center_x, 2) + math.pow(enemy_center_y - bullet_center_y, 2))
    if distance < 60:
        return True
    else:
        return False

# main game loop          
run = True
while run:

  clock.tick(60)

  screen.fill((33,24,72))

# add player image
  player(player_x,player_y) # function call

# if the bullet firing function is called here, it will fire a bullet as soon as the game begins, which is undesirable
  
  # loops through all the events(event handling)
  for event in pygame.event.get():

# quit game
    if event.type == pygame.QUIT:
      run= False

# if key is pressed
    if event.type==pygame.KEYDOWN: #if key has been pressed
      if event.key==pygame.K_RIGHT or event.key==pygame.K_d:
        player_change_x=5
      if event.key==pygame.K_LEFT or event.key==pygame.K_a:
        player_change_x=-5
      if event.key==pygame.K_SPACE and bullet_state == "ready":
        bullet_x=player_x + player_size_x // 2 - bullet_img.get_width() // 2
        bullet_y=player_y
        fire_bullet(bullet_x,bullet_y)

    if event.type==pygame.KEYUP: # without this, the image will just keep moving even when the key is released(example for snake)
      if event.key in [pygame.K_LEFT, pygame.K_RIGHT, pygame.K_a, pygame.K_d]:
        player_change_x=0

# update enemy position
  for i in range(no_of_enemies):
        enemy_x[i] += enemy_change_x[i]
        if enemy_x[i] <= 0:
            enemy_change_x[i] = 2
            enemy_y[i] += enemy_change_y[i]
        elif enemy_x[i] >= screen_x - enemy_size_x:
            enemy_change_x[i] = -2
            enemy_y[i] += enemy_change_y[i]
        if enemy_y[i] > player_y - enemy_change_y[i]:
           game="lost"

        # Collision
        collision = isCollision(enemy_x[i], enemy_y[i], bullet_x, bullet_y)
        if collision:
            bullet_y = player_y
            bullet_state = "ready"
            score += 1
            enemy_x[i] = random.randint(0, 736)
            enemy_y[i] = random.randint(50, 150)
        enemy(enemy_x[i], enemy_y[i], i)
  
  

# setting boundaries for images (updating player position)
  player_x+= player_change_x
  if player_x<0:
    player_x=0
  if player_x>(screen_x-player_size_x):# size of image is subtracted from the total
    player_x=screen_x-player_size_x
  
  # bullet bounds
  if bullet_y <= 0:
    bullet_y= player_y
    bullet_state="ready"

  # update bullet position
  if bullet_state == "fire":
    fire_bullet(bullet_x, bullet_y)
    bullet_y-=bullet_change_y


    # Display score
  font = pygame.font.Font(None, 36)
  score_text = font.render(f"Score: {score}", True, (255, 255, 255))
  screen.blit(score_text, (10, 10))

# check if game is won
  if score==10:
     game = "won"
     font = pygame.font.Font(None, 64)
     over_text = font.render("GAME OVER. \n You won!", True, (255, 0, 0))
     screen.blit(over_text, (screen_x // 2 - 150, screen_y // 2 - 32))
     pygame.display.update()
     pygame.time.delay(3000)
     break

  # check if game over
  if game=="lost":
        font = pygame.font.Font(None, 64)
        over_text = font.render("GAME OVER. \n You Lost.", True, (255, 0, 0))
        screen.blit(over_text, (screen_x // 2 - 150, screen_y // 2 - 32))
        pygame.display.update()
        pygame.time.delay(3000)
        break
   

  pygame.display.update()

pygame.quit()
