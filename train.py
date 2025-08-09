#!/usr/bin/env python3
import argparse
import os
from pathlib import Path

import gymnasium as gym
from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import CheckpointCallback, EvalCallback
from stable_baselines3.common.env_util import make_vec_env
from stable_baselines3.common.vec_env import VecTransposeImage
from stable_baselines3.common.monitor import Monitor


def build_env(n_envs: int, seed: int, render_mode: str | None = None):
    """Create a vectorized highway-v0 environment with image observations.

    We configure grayscale observations (84x84) and use VecFrameStack to stack 4 frames.
    """
    highway_config = {
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
        n_envs=n_envs,
        seed=seed,
        env_kwargs={"render_mode": render_mode, "config": highway_config},
    )
    env = VecTransposeImage(env)
    return env


def main():
    parser = argparse.ArgumentParser(description="Train a PPO agent for a kart-like driving task (highway-env highway-v0)")
    parser.add_argument("--timesteps", type=int, default=200_000, help="Total training timesteps")
    parser.add_argument("--n-envs", type=int, default=8, help="Number of parallel environments")
    parser.add_argument("--seed", type=int, default=0, help="Random seed")
    parser.add_argument("--save-dir", type=str, default="/workspace/runs/ppo_carracing", help="Directory to save models and logs")
    parser.add_argument("--checkpoint-freq", type=int, default=100_000, help="Checkpoint every N steps")
    parser.add_argument("--eval-episodes", type=int, default=5, help="Episodes for periodic evaluation")
    parser.add_argument("--learning-rate", type=float, default=3e-4, help="Optimizer learning rate")
    args = parser.parse_args()

    save_dir = Path(args.save_dir)
    save_dir.mkdir(parents=True, exist_ok=True)

    # Training env
    env = build_env(n_envs=args.n_envs, seed=args.seed)

    # Evaluation env (single with human-like observation pipeline but no rendering during training)
    eval_env = build_env(n_envs=1, seed=args.seed + 1)

    # Configure PPO. Ensure batch_size divides n_steps * n_envs
    n_steps = 1024
    batch_size = 256
    train_log_dir = str(save_dir / "tb_logs")

    model = PPO(
        policy="CnnPolicy",
        env=env,
        verbose=1,
        n_steps=n_steps,
        batch_size=batch_size,
        learning_rate=args.learning_rate,
        tensorboard_log=train_log_dir,
        seed=args.seed,
    )

    # save_freq is measured in number of environment steps
    checkpoint_callback = CheckpointCallback(
        save_freq=args.checkpoint_freq,
        save_path=str(save_dir / "checkpoints"),
        name_prefix="ppo_highway",
        save_replay_buffer=False,
        save_vecnormalize=False,
    )

    eval_callback = EvalCallback(
        eval_env=eval_env,
        best_model_save_path=str(save_dir / "best_model"),
        log_path=str(save_dir / "eval_logs"),
        eval_freq=50_000,
        n_eval_episodes=args.eval_episodes,
        deterministic=True,
        render=False,
    )

    model.learn(total_timesteps=args.timesteps, callback=[checkpoint_callback, eval_callback])

    final_model_path = save_dir / "ppo_highway_final"
    model.save(str(final_model_path))
    print(f"Saved final model to {final_model_path}")

    env.close()
    eval_env.close()


if __name__ == "__main__":
    main()