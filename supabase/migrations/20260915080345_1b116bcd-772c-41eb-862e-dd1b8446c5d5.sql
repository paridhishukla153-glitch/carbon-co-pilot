
-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  campus TEXT DEFAULT 'Banasthali Campus',
  community TEXT DEFAULT 'Hostel A',
  primary_goal TEXT DEFAULT 'reduce emissions without spending money',
  preferences TEXT[] NOT NULL DEFAULT ARRAY['Reduce emissions']::TEXT[],
  eco_points INT NOT NULL DEFAULT 0,
  streak_days INT NOT NULL DEFAULT 0,
  last_activity_date DATE,
  baseline_weekly_co2e NUMERIC(10,3) NOT NULL DEFAULT 0,
  seeded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ EMISSION FACTORS ============
CREATE TABLE public.emission_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  activity_type TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  unit TEXT NOT NULL,
  factor NUMERIC(10,4) NOT NULL,
  region TEXT NOT NULL DEFAULT 'IN',
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.emission_factors TO anon, authenticated;
GRANT ALL ON public.emission_factors TO service_role;
ALTER TABLE public.emission_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read factors" ON public.emission_factors FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.emission_factors (category, activity_type, label, unit, factor, source) VALUES
('transport','car','Car','km',0.1710,'Indicative India road transport factor (demo dataset)'),
('transport','motorcycle','Motorcycle','km',0.0720,'Indicative India road transport factor (demo dataset)'),
('transport','bus','Bus','km',0.0490,'Indicative India public transport factor (demo dataset)'),
('transport','train','Train / Metro','km',0.0410,'Indicative India rail factor (demo dataset)'),
('transport','bicycle','Bicycle','km',0.0000,'Zero direct tailpipe emissions'),
('transport','walking','Walking','km',0.0000,'Zero direct tailpipe emissions'),
('energy','electricity','Electricity','kWh',0.7100,'Indicative India grid emission factor (demo dataset)'),
('energy','lpg','LPG','kg',2.9800,'Indicative LPG combustion factor (demo dataset)'),
('food','vegetarian','Vegetarian meal','meal',0.9000,'Indicative per-meal factor (demo dataset)'),
('food','dairy','Dairy serving','serving',0.6000,'Indicative per-serving factor (demo dataset)'),
('food','chicken','Chicken meal','meal',2.3000,'Indicative per-meal factor (demo dataset)'),
('food','fish','Fish meal','meal',1.8000,'Indicative per-meal factor (demo dataset)'),
('food','red_meat','Red meat meal','meal',6.5000,'Indicative per-meal factor (demo dataset)');

-- ============ ACTIVITIES ============
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL,
  trips INT NOT NULL DEFAULT 1,
  emission_factor NUMERIC(10,4) NOT NULL,
  co2e NUMERIC(10,3) NOT NULL,
  occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL DEFAULT 'manual',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX activities_user_date_idx ON public.activities (user_id, occurred_on DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own activities" ON public.activities FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ FOOTPRINTS (weekly rollups) ============
CREATE TABLE public.footprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  week_start DATE NOT NULL,
  transport_co2e NUMERIC(10,3) NOT NULL DEFAULT 0,
  energy_co2e NUMERIC(10,3) NOT NULL DEFAULT 0,
  food_co2e NUMERIC(10,3) NOT NULL DEFAULT 0,
  other_co2e NUMERIC(10,3) NOT NULL DEFAULT 0,
  total_co2e NUMERIC(10,3) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.footprints TO authenticated;
GRANT ALL ON public.footprints TO service_role;
ALTER TABLE public.footprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own footprints" ON public.footprints FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ NUDGES ============
CREATE TABLE public.nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reason TEXT NOT NULL,
  action_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  potential_reduction_kg NUMERIC(10,3),
  provider TEXT NOT NULL DEFAULT 'mock',
  status TEXT NOT NULL DEFAULT 'shown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX nudges_user_idx ON public.nudges (user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nudges TO authenticated;
GRANT ALL ON public.nudges TO service_role;
ALTER TABLE public.nudges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own nudges" ON public.nudges FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.nudge_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nudge_id UUID NOT NULL REFERENCES public.nudges ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nudge_feedback TO authenticated;
GRANT ALL ON public.nudge_feedback TO service_role;
ALTER TABLE public.nudge_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own nudge feedback" ON public.nudge_feedback FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ CHALLENGES ============
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  target_actions INT NOT NULL DEFAULT 3,
  duration_days INT NOT NULL DEFAULT 7,
  eco_points INT NOT NULL DEFAULT 50,
  potential_reduction_kg NUMERIC(10,2) NOT NULL DEFAULT 1,
  demo_participants INT NOT NULL DEFAULT 0,
  ends_on DATE NOT NULL DEFAULT (CURRENT_DATE + 14),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.challenges TO anon, authenticated;
GRANT ALL ON public.challenges TO service_role;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read challenges" ON public.challenges FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.challenges (slug,title,description,category,difficulty,target_actions,duration_days,eco_points,potential_reduction_kg,demo_participants) VALUES
('car-free-friday','Car-Free Friday','Replace every car trip on Friday with walking, cycling or public transport.','transport','easy',3,7,50,2.40,148),
('walk-cycle-week','Walk & Cycle Week','Cover at least 15 km on foot or by bicycle over one week.','transport','medium',5,7,75,3.20,96),
('energy-smart','Energy Smart','Cut weekly electricity use by switching off idle appliances and using daylight.','energy','easy',4,7,60,5.60,132),
('meat-free-meals','Meat-Free Meals','Swap six meat meals for vegetarian meals this week.','food','medium',6,7,70,18.40,87),
('public-transit-week','Public Transit Week','Use the campus bus or metro instead of a car or two-wheeler for five journeys.','transport','medium',5,7,65,4.10,74);

CREATE TABLE public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  progress INT NOT NULL DEFAULT 0,
  co2e_avoided NUMERIC(10,3) NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (challenge_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challenge_participants TO authenticated;
GRANT ALL ON public.challenge_participants TO service_role;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own participation" ON public.challenge_participants FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.challenge_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  description TEXT NOT NULL,
  co2e_avoided NUMERIC(10,3) NOT NULL DEFAULT 0,
  verification_method TEXT NOT NULL DEFAULT 'manual',
  verification_status TEXT NOT NULL DEFAULT 'pending',
  evidence TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challenge_actions TO authenticated;
GRANT ALL ON public.challenge_actions TO service_role;
ALTER TABLE public.challenge_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own actions" ON public.challenge_actions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ BADGES ============
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'award'
);
GRANT SELECT ON public.badges TO anon, authenticated;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read badges" ON public.badges FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.badges (slug,title,description,icon) VALUES
('first-step','First Step','Logged your first activity.','footprints'),
('seven-day-streak','7-Day Streak','Logged activity seven days in a row.','flame'),
('car-free-champion','Car-Free Champion','Completed the Car-Free Friday challenge.','bike'),
('energy-saver','Energy Saver','Completed an energy reduction challenge.','zap'),
('community-leader','Community Leader','Reached the top 10 of your campus leaderboard.','users'),
('hundred-kg','100 kg CO₂ Avoided','Avoided 100 kg CO₂e through verified actions.','trophy');

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  badge_slug TEXT NOT NULL REFERENCES public.badges(slug) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_badges TO authenticated;
GRANT ALL ON public.user_badges TO service_role;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own badges" ON public.user_badges FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ COMMUNITIES (aggregate, demo) ============
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  campus TEXT NOT NULL DEFAULT 'Banasthali Campus',
  members INT NOT NULL DEFAULT 0,
  co2e_avoided NUMERIC(10,2) NOT NULL DEFAULT 0,
  verified_actions INT NOT NULL DEFAULT 0,
  participation_pct INT NOT NULL DEFAULT 0,
  is_demo BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT ON public.communities TO anon, authenticated;
GRANT ALL ON public.communities TO service_role;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read communities" ON public.communities FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.communities (name,members,co2e_avoided,verified_actions,participation_pct) VALUES
('Hostel A',184,612.40,1420,71),
('Hostel B',162,498.10,1180,64),
('Hostel C',139,377.90,905,52);

CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (community_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_members TO authenticated;
GRANT ALL ON public.community_members TO service_role;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own membership" ON public.community_members FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ CIVIC METRICS (anonymised aggregates) ============
CREATE TABLE public.civic_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL,
  region TEXT NOT NULL DEFAULT 'Banasthali / Newai',
  participants INT NOT NULL,
  co2e_avoided NUMERIC(10,2) NOT NULL,
  transport_shift_pct NUMERIC(5,2) NOT NULL,
  walk_cycle_km NUMERIC(10,2) NOT NULL,
  energy_reduction_kwh NUMERIC(10,2) NOT NULL,
  challenge_participation_pct NUMERIC(5,2) NOT NULL,
  is_demo BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (week_start, region)
);
GRANT SELECT ON public.civic_metrics TO anon, authenticated;
GRANT ALL ON public.civic_metrics TO service_role;
ALTER TABLE public.civic_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read civic" ON public.civic_metrics FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.civic_metrics (week_start,participants,co2e_avoided,transport_shift_pct,walk_cycle_km,energy_reduction_kwh,challenge_participation_pct) VALUES
(CURRENT_DATE - 56, 412, 218.40, 6.20, 3120.00, 4180.00, 22.50),
(CURRENT_DATE - 49, 468, 246.10, 7.10, 3480.00, 4520.00, 25.10),
(CURRENT_DATE - 42, 503, 271.80, 8.40, 3760.00, 4890.00, 28.30),
(CURRENT_DATE - 35, 561, 298.60, 9.10, 4105.00, 5230.00, 31.20),
(CURRENT_DATE - 28, 604, 331.20, 10.60, 4530.00, 5610.00, 34.80),
(CURRENT_DATE - 21, 648, 352.70, 11.80, 4860.00, 5980.00, 37.40),
(CURRENT_DATE - 14, 702, 389.30, 13.20, 5240.00, 6410.00, 41.10),
(CURRENT_DATE - 7,  758, 421.90, 14.60, 5610.00, 6830.00, 44.60);

-- ============ DEMO LEADERBOARD (synthetic, clearly labelled) ============
CREATE TABLE public.demo_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  community TEXT NOT NULL,
  campus TEXT NOT NULL DEFAULT 'Banasthali Campus',
  co2e_avoided_week NUMERIC(10,2) NOT NULL,
  co2e_avoided_month NUMERIC(10,2) NOT NULL,
  co2e_avoided_all NUMERIC(10,2) NOT NULL,
  eco_points INT NOT NULL,
  verified_actions INT NOT NULL,
  is_demo BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT ON public.demo_leaderboard TO anon, authenticated;
GRANT ALL ON public.demo_leaderboard TO service_role;
ALTER TABLE public.demo_leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read leaderboard" ON public.demo_leaderboard FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.demo_leaderboard (display_name,community,co2e_avoided_week,co2e_avoided_month,co2e_avoided_all,eco_points,verified_actions) VALUES
('Aarushi Mehta','Hostel A',9.80,38.40,142.60,1480,96),
('Nivedita Rao','Hostel B',9.10,36.20,131.40,1390,91),
('Sanya Kapoor','Hostel A',8.70,34.90,128.10,1325,88),
('Ishita Verma','Hostel C',8.20,33.10,119.70,1260,84),
('Meera Nair','Hostel B',7.90,31.80,114.20,1198,80),
('Prachi Singh','Hostel A',7.40,30.20,108.50,1140,77),
('Ananya Gupta','Hostel C',7.10,29.10,103.90,1092,74),
('Riya Sharma','Hostel B',6.80,27.60,98.40,1035,70),
('Kavya Iyer','Hostel A',6.40,26.30,93.80,988,67),
('Tanvi Joshi','Hostel C',6.10,25.10,89.10,942,64),
('Shreya Das','Hostel B',5.80,23.90,84.60,896,61),
('Neha Bansal','Hostel A',5.50,22.70,80.20,851,58),
('Pooja Reddy','Hostel C',5.10,21.40,75.90,804,55),
('Aditi Chauhan','Hostel B',4.80,20.20,71.30,758,52),
('Simran Kaur','Hostel A',4.40,18.90,66.80,712,49),
('Divya Menon','Hostel C',4.10,17.60,62.10,665,46),
('Ritika Agarwal','Hostel B',3.70,16.30,57.40,618,43),
('Sneha Pillai','Hostel A',3.40,15.10,52.90,572,40),
('Payal Yadav','Hostel C',3.00,13.80,48.20,525,37),
('Harini Suresh','Hostel B',2.70,12.50,43.60,479,34);
