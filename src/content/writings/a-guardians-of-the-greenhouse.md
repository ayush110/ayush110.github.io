---
title: Reflections on Final Year Capstone
date: 05/2026
---

By the end of capstone, we had built VineVision, a mobile camera system for forecasting tomato yield in greenhouses. But that wasn't the project we started with. Our first idea was essentially a robotic bee.

In the first few weeks, we didn't even know that agriculture would be our focus. We talked about accessibility, transportation, invasive species, and a bunch of other directions. Agriculture kept coming back up, so I started reading about how commercial greenhouses work. I hadn't realized how controlled these environments were. Growers manage lighting, humidity, carbon dioxide, irrigation, heating, and airflow, sometimes across acres of plants.

We became interested in pollination. Tomato flowers are self-pollinating, but they still need to be vibrated to release pollen. Bumblebees do this naturally through a process called sonication. Our original plan was to recreate that mechanically with some combination of cameras, a vibration tool, and a robot.

One of my first logbook entries had this flow:

> flower detection -> decide whether pollination is needed -> perform the action -> log the result -> verify

It was simple, but it gave us something to work from.

## Figuring out what to build

We spent a lot of the first semester exploring. Probably too much of it.

At different points, we considered a robot on rails, a small rover, a three-axis arm, an airflow system, a vibrating wand, and even a camera network for tracking bee activity. I had pages of hardware comparisons and architecture diagrams. One version of the backend used FastAPI, Postgres, TimescaleDB, and object storage, even though we had barely collected any real data yet.

Our capstone supervisor, Professor Roydon Fraser, was the first person to tell us plainly that the autonomous rail robot was too much. He was right. We would have needed to solve navigation, manipulation, perception, power, weatherproofing, and plant biology before we could even test whether the core idea was useful.

We cut the scope down, but we were still assuming that pollination was a major problem for growers. A visit to a greenhouse in Niagara changed that.

The grower we spoke with told us that natural pollination generally worked well. It could become less reliable during cloudy periods, winter, or other stressful conditions, but it wasn't the everyday problem we had made it out to be. In another interview, we heard that pests and disease were much more urgent concerns.

That was tough to hear after spending most of the semester on pollination. At the same time, it was better to find out then than to spend another four months building around a bad assumption.

What growers did talk about was forecasting. A tomato crop is difficult to count accurately while it is still growing, and mistakes in a mid-season yield forecast can be significant. Errors of **10-20%** can mean overproduction, missed commitments, and unstable planning. For a mid-size operation, the cost can reach roughly **$120,000-$150,000** in a year.

We already had many of the pieces needed to explore that problem: cameras, depth sensing, flower detection, and an idea for moving through greenhouse rows. So the project gradually moved away from robotic pollination and toward yield forecasting.

## Building VineVision

We called the new system **VineVision**.

It was a mobile, multi-camera sensing rig designed to attach to the scissor lifts that greenhouse workers already use. That was an important constraint for us. We didn't want the system to require permanent rails or major changes to the greenhouse just to be useful.

The rig used RGB and depth cameras connected to Raspberry Pis. The devices had to capture at roughly the same time, keep track of which camera produced which data, and upload everything to the backend without losing the connection between an image, its depth frame, its timestamp, and its location.

On the software side, we built the path from capture through storage, annotation, model inference, and visualization. We trained separate models for tomatoes and flowers:

- The tomato model classified fruit as unripe, half-ripe, or ripe and reached **mAP@50 = 0.947**.
- The flower model classified bud, anthesis, and post-anthesis stages and reached **mAP@50 = 0.902**.

Depth gave us more than a count. We used it to estimate tomato dimensions and volume, and then converted those estimates into weight. A grower plans around kilograms of produce, not the number of bounding boxes in an image, so getting from detection to a useful unit was an important part of the project.

## What the prototype actually looked like

Most of the work was less clean than the final architecture diagram made it look.

Our early setup had temporary camera mounts, loose cables, laptops balanced near the rig, and a tomato plant sitting in the middle of all of it. We would fix one problem and immediately notice another. Moving a camera affected calibration. A failed upload could leave part of a capture without its matching metadata. A naming mistake could make a perfectly good image difficult to use later.

The greenhouse itself made things harder. Lighting changed throughout the day. Leaves hid fruit. Reflective surfaces affected depth sensing. Humidity and condensation were a concern for the electronics. Even mounting the cameras at the right height became a real design problem once we stopped testing everything on a desk.

I spent much of my time on the capture and backend side of the system: coordinating the devices, organizing the data, and getting it from the rig into something we could inspect and use. That work made synchronization feel much less abstract. If the devices disagreed about time, or one identifier was missing, the problem would show up later as bad data without an obvious cause.

That was probably my favourite part of the project. I liked that the bottleneck changed all the time. Some days it was hardware. Other days it was networking, data organization, the model, or the dashboard. There was always another layer to understand.

## What I would change

I would talk to growers much earlier.

We did a lot of research in the first semester, but we waited until around week ten to visit the greenhouse in Niagara. If we had made that visit in week two, we probably wouldn't have spent so much time designing a pollination robot before confirming that the problem mattered.

I would also get one very small version of the complete system working before expanding it: one camera, one plant, one capture, one upload, one prediction, and one result in the dashboard. We explored several fairly detailed architectures before proving that basic path. Building it earlier would have shown us where the real integration problems were.

The last thing I would change is how we treated the prototype. A rig for collecting research data and a rig for working in a greenhouse have different jobs. The first should be easy to adjust and debug. The second should have secure mounts, protected electronics, clean cable routing, and a way to recover when something fails. We tried to move toward both at the same time, which made some decisions harder than they needed to be.

## Looking back

I'm glad the project changed as much as it did. The first idea was more obviously robotic and probably more exciting on paper, but it wasn't as well grounded in what growers needed.

The project also changed how I think about machine-learning systems. Model accuracy matters, but it is only one part of the result. The cameras need to capture usable data. The devices need to agree on what they captured. The backend needs to preserve that context. The physical rig needs to work somewhere other than our test setup.

None of those details are especially impressive on their own, but together they determine whether the system works.

## Recognition

We were fortunate to receive the [**Systems Design Engineering at the University of Waterloo**](https://www.linkedin.com/company/systems-design-engineering-at-the-university-of-waterloo/) Sustainability Award (**$1000**) and the [**University of Waterloo Faculty of Engineering**](https://www.linkedin.com/company/faculty-of-engineering/) Sustainability Award (**$1000**). We also received **$1400** in support from the Engineers of the Future Fund and won [Velocity's Agri-Food Innovation Challenge](https://velocityincubator.com/) (**$2500**).

The awards were exciting, but presenting the project to people outside our class was just as valuable. We had to explain why this problem mattered without hiding behind technical language, and answer questions from people who had not followed all of the decisions that brought us there.

## Artifacts

<ul class="resource-list">
  <li>
    <a class="resource-link" href="src/assets/greenhouse/greenhouse-guardians-paper.pdf" target="_blank" rel="noopener noreferrer">
      <span class="resource-label">Conference paper</span>
      <span class="resource-note">VineVision: Mobile Multi-Camera Yield Forecasting for Mid-Size Greenhouse Tomato Production</span>
    </a>
  </li>
  <li>
    <a class="resource-link" href="src/assets/greenhouse/greenhouse-guardians-poster.pdf" target="_blank" rel="noopener noreferrer">
      <span class="resource-label">Capstone poster</span>
      <span class="resource-note">Full symposium poster as a PDF</span>
    </a>
  </li>
</ul>

## Poster

<figure>
  <a href="src/assets/greenhouse/greenhouse-guardians-poster.pdf" target="_blank" rel="noopener noreferrer">
    <img src="src/assets/greenhouse/poster-preview.png" alt="Capstone symposium poster for Guardians of the Greenhouse." />
  </a>
  <figcaption>The symposium poster distilled the problem framing, system design, and model results into a single artifact for technical and non-technical audiences.</figcaption>
</figure>

## Gallery

<div class="post-gallery post-gallery--single">
  <figure>
    <img src="src/assets/greenhouse/prototype-fixed.jpg" alt="Early VineVision prototype with the sensor bar, adjustable mast, and electronics mounted during development." />
    <figcaption>An early prototype of the sensing rig during development. This was the phase where packaging, mounting, and field practicality mattered as much as the vision pipeline.</figcaption>
  </figure>
</div>

<div class="post-gallery">
  <figure>
    <img src="src/assets/greenhouse/presentation-fixed.jpg" alt="The team presenting Guardians of the Greenhouse with the rig, a tomato plant, and the project dashboard." />
    <figcaption>Presenting the project with the mobile rig, live dashboard, and sample plant.</figcaption>
  </figure>
  <figure>
    <img src="src/assets/greenhouse/award.jpg" alt="The team standing together at the Agri-Food Innovation Challenge awards event." />
    <figcaption>At the Agri-Food Innovation Challenge finals after presenting the project publicly.</figcaption>
  </figure>
</div>

<div class="post-gallery">
  <figure>
    <img src="src/assets/greenhouse/team-poster-fixed.jpg" alt="The team beside the Guardians of the Greenhouse symposium poster and demo setup." />
    <figcaption>Poster-day version of the project with the full capstone setup and supporting demo material.</figcaption>
  </figure>
  <figure>
    <img src="src/assets/greenhouse/symposium-booth-fixed.jpg" alt="The full symposium booth showing the poster, demo screens, the tomato plant, and the mobile sensing cart." />
    <figcaption>The full symposium booth: sensing cart, model outputs, dashboard, poster, and the physical crop context all in one place.</figcaption>
  </figure>
</div>
