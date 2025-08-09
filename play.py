#!/usr/bin/env python3
import argparse
from pathlib import Path

import gymnasium as gym
from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env
from stable_baselines3.common.vec_env import VecTransposeImage


def build_eval_env(render: bool = True):
    config = {
        "observation": {
            "type": "GrayscaleObservation",
            "weights": [0.2989, 0.5870, 0.1140],
            "observation_shape": (84, 84),
            "stack_size": 4,
        },
        "duration": 40,
        "policy_frequency": 5,
    }
    env = make_vec_env(
        "highway-v0",
        n_envs=1,
        env_kwargs={"render_mode": "human" if render else None, "config": config},
    )
    env = VecTransposeImage(env)
    return env


def main():
    parser = argparse.ArgumentParser(description="Play with a trained PPO model")
    parser.add_argument("--model", type=str, default="/workspace/runs/ppo_carracing/ppo_carracing_final.zip", help="Path to trained model .zip")
    args = parser.parse_args()

    model_path = Path(args.model)
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    env = build_eval_env(render=True)
    model = PPO.load(str(model_path))

    obs = env.reset()
    while True:
        action, _ = model.predict(obs, deterministic=True)
        obs, reward, terminated, truncated, info = env.step(action)
        done = bool(terminated[0] or truncated[0])
        if done:
            obs = env.reset()


if __name__ == "__main__":
    main()