import urllib.request
import time
import os

os.makedirs('public/players', exist_ok=True)

players = {
  'messi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
  'ronaldo.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg',
  'haaland.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Erling_Haaland_Morocco_v_Norway_7_June_2026-51.jpg/500px-Erling_Haaland_Morocco_v_Norway_7_June_2026-51.jpg',
  'mbappe.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg/500px-Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg',
  'yamal.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Lamine_Yamal_France_v_Spain_7.24.26-142.jpg/500px-Lamine_Yamal_France_v_Spain_7.24.26-142.jpg',
  'vinicius.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_%28cropped%29.jpg/500px-Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_%28cropped%29.jpg',
  'bellingham.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Jude_Bellingham_England_v_Ghana_23_June_2026-061_%28cropped%29.jpg/500px-Jude_Bellingham_England_v_Ghana_23_June_2026-061_%28cropped%29.jpg',
  'saka.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Bukayo_Saka_England_v_Ghana_23_June_2026-057_%28cropped%29.jpg/500px-Bukayo_Saka_England_v_Ghana_23_June_2026-057_%28cropped%29.jpg',
  'salah.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Mohamed_Salah_Argentina_v_Egypt_7_July_2026-163_%28cropped%29.jpg/500px-Mohamed_Salah_Argentina_v_Egypt_7_July_2026-163_%28cropped%29.jpg',
  'debruyne.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg/500px-Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg',
  'rodri.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Rodri_Argentina_v_Spain_19_July_2026-187_%28cropped%29.jpg/500px-Rodri_Argentina_v_Spain_19_July_2026-187_%28cropped%29.jpg',
  'palmer.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Cole_Palmer_2025_FIFA_Club_World_Cup_Final.jpg',
  'foden.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2613%2C_Phil_Foden.jpg/500px-2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2613%2C_Phil_Foden.jpg',
  'rice.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Declan_Rice_England_v_Ghana_23_June_2026-150.jpg/500px-Declan_Rice_England_v_Ghana_23_June_2026-150.jpg',
  'vandijk.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/20160604_AUT_NED_8876_%28cropped%29.jpg/500px-20160604_AUT_NED_8876_%28cropped%29.jpg',
  'chhetri.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/The_President%2C_Shri_Ram_Nath_Kovind_presenting_the_Major_Dhyan_Chand_Khel_Ratna_Award%2C_2021_to_Shri_Sunil_Chhetri_for_Football%2C_at_Rashtrapati_Bhavan%2C_in_New_Delhi_on_13_November_2021_%28cropped%29.jpg',
  'petratos.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Dimitri_Petratos.jpg',
  'chhangte.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Lallianzuala-Chhangte-1-scaled.jpg',
  'gurpreet.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/32/Gurpreet_Singh_Sandhu_2019_AFC_Asian_Cup.jpg',
  'jhingan.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Sandesh_Jjhingan_2019_AFC_AsianCup.jpg',
  'thapa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/21/Anirudh_Thapa_2019_%28cropped%29.jpg',
  'bose.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/India_NT_at_2019_AFC_Asian_Cup_%28cropped%29.jpg',
  'aitana.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/25th_Laureus_World_Sports_Awards_-_240422_214032.jpg/500px-25th_Laureus_World_Sports_Awards_-_240422_214032.jpg',
  'alexia.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Premios_Goya_2026_-_Alexia_Putellas_%28cropped%29.jpg/500px-Premios_Goya_2026_-_Alexia_Putellas_%28cropped%29.jpg',
  'sam_kerr.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Sam_Kerr_Gotham_v_Seattle_18_July_2026-378_%28cropped%29.jpg/500px-Sam_Kerr_Gotham_v_Seattle_18_July_2026-378_%28cropped%29.jpg',
  'russo.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/20260927-Alessia_Russo.jpg/500px-20260927-Alessia_Russo.jpg',
  'sophia_smith.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Sophia_Wilson_Gotham_v_Portland_28_August_2026-022_%28cropped%29.jpg/500px-Sophia_Wilson_Gotham_v_Portland_28_August_2026-022_%28cropped%29.jpg',
  'mary_earps.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Mary_Earps_Man_Utd.jpg/500px-Mary_Earps_Man_Utd.jpg',
  'lauren_james.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Lauren_James_Eng_Women_0_Czech_Rep_0_11_10_2022-488_%2852426864234%29_%28cropped_-_James%29.jpg/500px-Lauren_James_Eng_Women_0_Czech_Rep_0_11_10_2022-488_%2852426864234%29_%28cropped_-_James%29.jpg',
  'trinity_rodman.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Trinity_Rodman_USWNT_v_Colombia_Mar_7_2026-87_%28cropped%29.jpg/500px-Trinity_Rodman_USWNT_v_Colombia_Mar_7_2026-87_%28cropped%29.jpg',
  'linda_caicedo.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Linda_Caicedo_USWNT_v_Colombia_Mar_7_2026-97.jpg/500px-Linda_Caicedo_USWNT_v_Colombia_Mar_7_2026-97.jpg',
  'miedema.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Miedemavliverpool.jpg/500px-Miedemavliverpool.jpg',
}

headers = {
  'User-Agent': 'FootBuzzBot/1.0 (https://footbuzz.app; contact@footbuzz.app)'
}

for filename, url in players.items():
  target_path = os.path.join('public/players', filename)
  if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
    print(f'Already downloaded: {filename}')
    continue
  try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
      content = resp.read()
      with open(target_path, 'wb') as f:
        f.write(content)
      print(f'Downloaded {filename} ({len(content)} bytes)')
  except Exception as e:
    print(f'Error downloading {filename}: {e}')
  time.sleep(1.2)
