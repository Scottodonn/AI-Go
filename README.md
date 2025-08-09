# Kart-like RL Bot (PPO on highway-v0)

This project trains a driving agent with PPO on the Gymnasium `highway-v0` environment using grayscale image observations with frame stacking. It is a simulator-only, ethical stand‑in for kart/racing games.

## Setup

```bash
python3 -m pip install --upgrade pip
# Install PyTorch CPU wheels first (fast, reliable)
python3 -m pip install --index-url https://download.pytorch.org/whl/cpu torch torchvision torchaudio
# Then the rest
python3 -m pip install -r /workspace/requirements.txt
```

## Train

```bash
python3 /workspace/train.py --timesteps 100000 --n-envs 4 --save-dir /workspace/runs/ppo_highway
```

Notes:
- Observations use grayscale 84x84 with 4-frame stacking handled by the env config.
- Checkpoints and best model are written under `/workspace/runs/ppo_highway`.
- Launch TensorBoard to monitor training:

```bash
python3 -m tensorboard.main --logdir /workspace/runs/ppo_highway/tb_logs --host 0.0.0.0 --port 6006
```

## Play (render)

```bash
python3 /workspace/play.py --model /workspace/runs/ppo_highway/ppo_highway_final.zip
```

If you want to watch the best checkpoint instead:

```bash
python3 /workspace/play.py --model /workspace/runs/ppo_highway/best_model/best_model.zip
```

## Tips
- Increase `--timesteps` for better performance; 0.5–2M is common.
- You can tweak PPO hyperparameters in `train.py` (e.g., `n_steps`, `batch_size`, `learning_rate`).
- Training is CPU‑capable but faster with GPU.

## Ethics
This code is for research and simulator environments only. Do not deploy agents to online games or services in ways that violate their terms or fairness.
