"""
MotionX — Synthetic Mumbai Public Transport Dataset Generator
Generates 25,200+ realistic observations with rush-hour peaks, weather impact,
special events, and route capacity dynamics.
"""

import csv
import math
import os
import random

RANDOM_SEED = 42
random.seed(RANDOM_SEED)

ROUTES = [
    {"route_id": "101", "route_name": "101 — Borivali → Andheri", "mode": "BUS", "capacity": 700, "distance_km": 14.8},
    {"route_id": "202", "route_name": "202 — Bandra → Kurla (BKC Express)", "mode": "BUS", "capacity": 650, "distance_km": 8.5},
    {"route_id": "302", "route_name": "302 — Dadar → Mulund", "mode": "TRAIN", "capacity": 1000, "distance_km": 21.5},
    {"route_id": "421", "route_name": "421 — Thane → Ghatkopar", "mode": "TRAIN", "capacity": 1100, "distance_km": 18.2},
    {"route_id": "505", "route_name": "505 — Navi Mumbai → Kurla", "mode": "BUS", "capacity": 600, "distance_km": 24.5},
    {"route_id": "610", "route_name": "610 — Andheri → Dadar", "mode": "TRAIN", "capacity": 1200, "distance_km": 12.3},
    {"route_id": "715", "route_name": "715 — Borivali → Bandra", "mode": "TRAIN", "capacity": 1150, "distance_km": 22.0},
    {"route_id": "820", "route_name": "820 — Ghatkopar → Thane", "mode": "BUS", "capacity": 550, "distance_km": 16.4},
]

WEATHER_CONDITIONS = ["clear", "cloudy", "rain", "heavy_rain"]
WEATHER_WEIGHTS = [0.60, 0.25, 0.10, 0.05]

def get_hour_demand_factor(hour: int, is_weekend: bool) -> float:
    """Returns baseline demand factor for a given hour."""
    if is_weekend:
        # Weekend curve: later morning wakeup, higher afternoon/evening leisure
        if hour < 6:
            return 0.05
        elif 6 <= hour < 11:
            return 0.45 + (hour - 6) * 0.08
        elif 11 <= hour < 17:
            return 0.75 + math.sin(hour) * 0.05
        elif 17 <= hour < 21:
            return 0.90 + math.cos(hour) * 0.08
        else:
            return 0.35 - (hour - 21) * 0.10
    else:
        # Weekday curve: sharp morning peak (07:00-10:00) and evening peak (17:00-21:00)
        if hour < 5:
            return 0.04
        elif hour == 5:
            return 0.20
        elif hour == 6:
            return 0.50
        elif hour == 7:
            return 0.85
        elif 8 <= hour <= 9:
            return 1.35  # Overcrowding surge
        elif hour == 10:
            return 0.95
        elif 11 <= hour <= 15:
            return 0.68  # Midday steady
        elif hour == 16:
            return 0.85
        elif 17 <= hour <= 19:
            return 1.30  # Evening peak
        elif hour == 20:
            return 1.05
        elif hour == 21:
            return 0.70
        elif hour == 22:
            return 0.40
        else:
            return 0.15

def generate_dataset(num_days: int = 135, output_path: str = "backend/data/generated/transit_demand_mumbai.csv"):
    """
    Generates ~25,920 records (8 routes * 24 hours * 135 days)
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    fieldnames = [
        "route_id", "route_name", "mode", "hour", "day_of_week",
        "is_weekend", "is_holiday", "weather_condition", "temperature",
        "historical_ridership", "previous_hour_ridership", "route_capacity",
        "special_event", "distance_km", "ridership"
    ]

    total_rows = 0
    with open(output_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for route in ROUTES:
            cap = route["capacity"]
            for day in range(num_days):
                day_of_week = day % 7
                is_weekend = 1 if day_of_week in [5, 6] else 0
                is_holiday = 1 if day % 30 == 0 and not is_weekend else 0
                
                # Daily weather sample
                weather = random.choices(WEATHER_CONDITIONS, weights=WEATHER_WEIGHTS)[0]
                base_temp = 32 if weather == "clear" else (28 if "rain" in weather else 30)

                # Special event (e.g. Cricket match at Wankhede, Ganpati immersion, BKC expo)
                special_event = 1 if random.random() < 0.04 else 0

                prev_ridership = int(cap * 0.1)

                for hour in range(24):
                    factor = get_hour_demand_factor(hour, bool(is_weekend))
                    
                    # Weather multipliers
                    weather_mult = 1.0
                    if weather == "rain":
                        weather_mult = 1.08  # Public transit preferred over two-wheelers
                    elif weather == "heavy_rain":
                        weather_mult = 1.18  # Flooded roads force crowd onto trains/buses

                    # Event multiplier
                    event_mult = 1.25 if (special_event and (17 <= hour <= 22)) else 1.0

                    # Holiday effect
                    holiday_mult = 0.70 if is_holiday else 1.0

                    # Route popularity modifier
                    route_mult = 1.15 if route["route_id"] in ["302", "421"] else 1.0

                    base_demand = cap * factor * weather_mult * event_mult * holiday_mult * route_mult
                    
                    # Realistic Gaussian noise (~4%)
                    noise = random.gauss(0, cap * 0.04)
                    ridership = max(15, int(base_demand + noise))

                    # Historical average (with long term variation)
                    historical_ridership = int(cap * factor * route_mult)

                    temp = base_temp + random.randint(-2, 2) - (2 if hour < 6 else 0)

                    writer.writerow({
                        "route_id": route["route_id"],
                        "route_name": route["route_name"],
                        "mode": route["mode"],
                        "hour": hour,
                        "day_of_week": day_of_week,
                        "is_weekend": is_weekend,
                        "is_holiday": is_holiday,
                        "weather_condition": weather,
                        "temperature": temp,
                        "historical_ridership": historical_ridership,
                        "previous_hour_ridership": prev_ridership,
                        "route_capacity": cap,
                        "special_event": special_event,
                        "distance_km": route["distance_km"],
                        "ridership": ridership
                    })
                    prev_ridership = ridership
                    total_rows += 1

    print(f"Generated {total_rows} observations saved to {output_path}")

if __name__ == "__main__":
    generate_dataset()
