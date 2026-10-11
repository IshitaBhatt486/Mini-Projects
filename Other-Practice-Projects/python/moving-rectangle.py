import pygame
pygame.init()

screen = pygame.display.set_mode((800, 600))

player = pygame.Rect((50,50,50,50))

run = True
while run:

# refresh the screen so that the rectangle does not leave behind a trail
    screen.fill((0,0,0))

# move the rectangle
    pygame.draw.rect(screen,(255,15,40), player)
    key=pygame.key.get_pressed()
    if key[pygame.K_a]==True:
        player.move_ip(-1,0)
    elif key[pygame.K_d]==True:
        player.move_ip(1,0)
    elif key[pygame.K_w]==True:
        player.move_ip(0,-1)
    elif key[pygame.K_s]==True:
        player.move_ip(0,1)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run= False

    pygame.display.update()

pygame.quit()